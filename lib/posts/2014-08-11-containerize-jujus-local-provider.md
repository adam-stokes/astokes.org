---
layout: post.jade
title: Containerize juju's local provider
date: 2014-08-11T11:05Z
featured: juju.png
tags: ubuntu, openstack
---
## Current approach

Juju's existing providers(except manual) do not allow you to containerize the bootstrap node. However, in the manual provider this is possible using something like this in your **environments.yaml** file and setting the **boostrap-host** appropriately:

```yaml
    ## https://juju.ubuntu.com/docs/config-manual.html
    manual:
        type: manual
        # bootstrap-host holds the host name of the machine where the
        # bootstrap machine agent will be started.org
        bootstrap-host: somehost.example.com
        # bootstrap-user specifies the user to authenticate as when
        # connecting to the bootstrap machine. If defaults to
        # the current user.
        # bootstrap-user: joebloggs
        # storage-listen-ip specifies the IP address that the
        # bootstrap machine's Juju storage server will listen
        # on. By default, storage will be served on all
        # network interfaces.
        # storage-listen-ip:
        # storage-port specifes the TCP port that the
        # bootstrap machine's Juju storage server will listen
        # on. It defaults to 8040
        # storage-port: 8040
```

Cool, that will allow me to bootstrap juju on something other than my host machine. But, that machine needs to be configured appropriately for a non-interactive deployment (setting ssh keys, passwordless sudo, etc).

## A different approach

In my particular case we wanted our Openstack Installer to be fully containerized from juju bootstrap to deploying of compute nodes. In order to achieve this we need to configure an existing container to be our bootstrap agent **and** still allow for our mixture of kvm/lxc environments for use within the Openstack deployment.

### Walkthrough

Create a container named **joojoo** that will be used as our Juju bootstrap agent:

```bash
ubuntu@fluffy:~$ sudo lxc-create -t ubuntu -n joojoo
```

Update the container's **lxcbr0** to be on its own network:

```bash
ubuntu@fluffy:~$ cat >>-EOF | sudo tee /var/lib/lxc/joojoo/rootfs/etc/default/lxc-net
    USE_LXC_BRIDGE="true"
    LXC_BRIDGE="lxcbr0"
    LXC_ADDR="10.0.4.1"
    LXC_NETMASK="255.255.255.0"
    LXC_NETWORK="10.0.4.0/24"
    LXC_DHCP_RANGE="10.0.4.2,10.0.4.254"
    LXC_DHCP_MAX="253"
    EOF
```

Create the necessary character files for kvm support within lxc via `mknod`, also persist them through reboots.

```bash
ubuntu@fluffy:~$ cat >>-EOF | sudo tee /var/lib/lxc/joojoo/rootfs/etc/rc.local
    #!/bin/sh
    mkdir -p /dev/net || true
    mknod /dev/kvm c 10 232
    mknod /dev/net/tun c 10 200
    exit 0
    EOF
```

Start the container

```bash
ubuntu@fluffy:~$ sudo lxc-start -n joojoo -d
```

Pre-install libvirt and uvtools

```bash
ubuntu@fluffy:~$ sudo lxc-attach -n joojoo -- apt-get update
ubuntu@fluffy:~$ sudo lxc-attach -n joojoo -- apt-get install -qyf \
   libvirt-bin uvtool uvtool-libvirt software-properties-common
```
Make sure our **ubuntu** user has the correct `libvirtd` group associated

```bash
ubuntu@fluffy:~$ sudo lxc-attach -n joojoo -- usermod -a -G libvirtd ubuntu
```

### Now that you have a containerized environment ready for Juju, lets test!

The LXC container should now be ready for a juju deployment. Lets use our Openstack Cloud Installer to test this setup. I want to make sure everything deploys into its appropriate containers/kvm instances and that I can still access the Horizon dashboard to deploy a compute instance.

First, ssh into your container, you can get the IP with the `lxc-ls -f` command:

```bash
ubuntu@fluffy:~$ sudo lxc-ls -f joojoo
    NAME    STATE    IPV4       IPV6  AUTOSTART
    -------------------------------------------
    joojoo  RUNNING  10.0.3.3   -     NO

ubuntu@fluffy:~$ ssh ubuntu@10.0.3.3
```

Within the container add our PPA and perform the installation:

```bash
ubuntu@joojoo:~$ sudo apt-add-repository ppa:cloud-installer/experimental
ubuntu@joojoo:~$ sudo apt-add-repository ppa:juju/stable
ubuntu@joojoo:~$ sudo apt update && sudo apt install cloud-installer
ubuntu@joojoo:~$ sudo openstack-install
```

**Note** I'm using our experimental PPA for Openstack Cloud Installer which will be our next major release and will automate the previous steps for putting juju within a container.

This test I'm using the **Single Install** method, so select that and enter a Openstack password of your choice. Now sit back and wait for the installation to finish.

### Recap

First we created a LXC container to be used as our **entry point** for juju to bootstrap itself too. This required some configuration changes to how the container will handle bridged connections along with making sure the character devices required by KVM are available.

Next we installed some pre-requisites for libvirt and uvtools.

From there we login to the newly created container, install, and run the Openstack Cloud Installer. This will install juju-core and lxc as dependencies along with automatically configuring lxc-net with our predefined `lxc-net` template, seen in the latest `lxc-ls` output (showing eth0, lxcbr0, and virbr0):

```bash
ubuntu@fluffy:~$ sudo lxc-ls -f
    NAME    STATE    IPV4                               IPV6  AUTOSTART  
    -------------------------------------------------------------------
    joojoo  RUNNING  10.0.3.3, 10.0.4.1, 192.168.122.1  -     NO
```

Once the installer is finished we verify that our LXC container was able to facilitate the deployment of services in both LXC (nested) and KVM (also nested within LXC).

It's a long list so here is the [pastebin](http://paste.ubuntu.com/8021230/). What you'll notice is that all machines/services are now bound to the 10.0.4.x network which is what was defined in the `lxc-net` configuration above. We have KVM's running within our host container which also houses containers for the Openstack deployment.

Just to give a more visual representation of the setup:

```
Baremetal Machine
- LXC Container
  - Runs juju bootstrap agent
    - KVM (machine 1)
      - Houses a bunch of LXC's for the openstack services
    - KVM (machine 2)
      - Houses nova-compute
    - KVM (machine 3)
      - Houses quantum-gateway
```

### Why is this a good thing?

```bash
ubuntu@fluffy:~$ sudo lxc-stop -n joojoo
ubuntu@fluffy:~$ sudo lxc-destroy -n joojoo
```

And it's like it never happened ...

## Acknowledgements

Thanks to a colleague, [Robert Ayres](http://voices.canonical.com/robert.ayres/), who provided the necessary information for getting KVM to run within an LXC container.
