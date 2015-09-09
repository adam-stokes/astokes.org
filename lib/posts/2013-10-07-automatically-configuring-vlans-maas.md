---
layout: post.jade
title: Configuring VLANs in MAAS node deployment
date: 2013-10-07T22:55Z
tags:
- ubuntu
- maas
- preseed
- di
- debian installer
- bare metal
- fastpath
---
Since Debian installer doesn't have the ability to configure [vlans](http://en.wikipedia.org/wiki/Virtual_LAN) we need to make any additional network modifications within the `preseed/late_command` stage. If you aren't familiar with vlan or would like some more details on setting it up take a look at [Ubuntu vlan wiki page](https://wiki.ubuntu.com/vlan). Also I don't have the hardware to test the actual switching so hopefully someone will read this and let me know what I've missed. I checked into [gns3](http://www.gns3.net/) but it is my understanding it would be impossible to emulate the switching that Cisco hardware would.

## Assumptions

Yea assumptions are baad, however, this article assumes you have an interface `eth0` that supports vlan tagging (802.1q) and that a hardware switch exists that has been configured for vlans.

## Preseed naming conventions in MAAS

The order in which [MAAS](http://maas.ubuntu.com) loads a preseed file is seen below:

```jinja2
{prefix}_{node_architecture}_{node_subarchitecture}_{release}_{node_name}
{prefix}_{node_architecture}_{node_subarchitecture}_{release}
{prefix}_{node_architecture}_{node_subarchitecture}
{prefix}_{node_architecture}
{prefix}
'generic'
```

> ### Note:
> If you wish to keep your distro provided preseeds in-tact and use an
> alternative you could always name a new preseed with something like
> `amd64_generic_precise` and when deploying your nodes with the
> precise image it would pick up that preseed instead of
> `generic`. More information at
> **[How preseeds work](http://maas.ubuntu.com/docs/development/preseeds.html)**

## Modifying the preseeds for vlan support

The preseeds are located within `/etc/maas/preseeds`. For now the only
preseed files we are concerned with is `preseed_master` and `generic`.

Opening up `preseed_master` we see a typical preseed configuration and scrolling to the bottom you'll see:

```
# Post scripts.
{{self.post_scripts}}
```

This method is exposed as part of the [Tempita](http://pythonpaste.org/tempita/) template engine which we'll see defined in our `generic` template next.

Opening `generic` template we'll see something like the below:

```yaml
{{inherit "preseed_master"}}

{{def proxy}}
d-i     mirror/country string manual
d-i     mirror/http/hostname string {{ports_archive_hostname}}
d-i     mirror/http/directory string {{ports_archive_directory}}
{{if http_proxy }}
d-i     mirror/http/proxy string {{http_proxy}}
{{else}}
d-i     mirror/http/proxy string http://{{server_host}}:8000/
{{endif}}
{{enddef}}

{{def client_packages}}
d-i     pkgsel/include string cloud-init openssh-server python-software-properties vim avahi-daemon server^
{{enddef}}

{{def preseed}}
{{preseed_data}}
{{enddef}}

{{def post_scripts}}
# Executes late command and disables PXE.
d-i     preseed/late_command string true && \
    in-target sh -c 'f=$1; shift; echo $0 > $f && chmod 0440 $f $*' 'ubuntu ALL=(ALL) NOPASSWD: ALL' /etc/sudoers.d/maas && \
    in-target wget --no-proxy "{{node_disable_pxe_url|escape.shell}}" --post-data "{{node_disable_pxe_data|escape.shell}}" -O /dev/null && \
    true
{{enddef}}
```

Most of this should be self explanatory as this basically outlines the
typical usage of most template engines. We `inherit 'preseed_master'`
which calls `self` and we provide our method definitions with `{{def
<method>}}`. Scroll down your `generic` preseed file and locate `{{def
post_scripts}}`.

This definition is what's called from our `preseed_master`
configuration and where we'll add our vlan options. We'll make a call
out to a `vlansetup` file hosted on the same server as maas, usually
found in `/var/www/`.

```yaml
{{def post_scripts}}
# Executes late command and disables PXE.
d-i     preseed/late_command string true && \
    in-target sh -c 'f=$1; shift; echo $0 > $f && chmod 0440 $f $*' 'ubuntu ALL=(ALL) NOPASSWD: ALL' /etc/sudoers.d/maas && \
    in-target wget --no-proxy "{{node_disable_pxe_url|escape.shell}}" --post-data "{{node_disable_pxe_data|escape.shell}}" -O /dev/null && \
    wget -O /tmp/vlansetup http://192.168.122.206/vlansetup && \
    chmod +x /tmp/vlansetup && \
    sh -x /tmp/vlansetup && \
    rm -f /tmp/vlansetup && \
    true
{{enddef}}
```

Our `vlansetup` file would look something like

```bash
#!/bin/sh
/bin/apt-install vlan
echo "8021q" >> /target/etc/modules
cat >>/target/etc/network/interfaces<<EOF
auto vlan5
auto vlan100
iface vlan5 inet static
  address 10.0.0.18
  netmask 255.255.255.0
  vlan-raw-device eth0
iface vlan100 inet static
  address 192.168.66.118
  netmask 255.255.255.0
  vlan-raw-device eth0
EOF
```

After the node is deployed you should see something like the following in your syslog output.

```
Set name-type for VLAN subsystem. Should be visible in /proc/net/vlan/config
Added VLAN with VID == 5 to IF -:eth0:-
Set name-type for VLAN subsystem. Should be visible in /proc/net/vlan/config
Added VLAN with VID == 100 to IF -:eth0:-
```

And `/proc/net/vlan/config` should look like

```
ubuntu@node1:~$ sudo cat /proc/net/vlan/config 
VLAN Dev name    | VLAN ID
Name-Type: VLAN_NAME_TYPE_PLUS_VID_NO_PAD
vlan5          | 5  | eth0
vlan100        | 100  | eth0
```

Last but not least `ifconfig` reports

```
eth0      Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
          inet addr:192.168.122.144  Bcast:192.168.122.255  Mask:255.255.255.0
          inet6 addr: fe80::5054:ff:fe2a:37ac/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:148 errors:0 dropped:0 overruns:0 frame:0
          TX packets:227 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:20214 (20.2 KB)  TX bytes:34006 (34.0 KB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

vlan5     Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
          inet addr:10.0.0.18  Bcast:10.0.0.255  Mask:255.255.255.0
          inet6 addr: fe80::5054:ff:fe2a:37ac/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:40 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:6600 (6.6 KB)

vlan100   Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
          inet addr:192.168.66.118  Bcast:192.168.66.255  Mask:255.255.255.0
          inet6 addr: fe80::5054:ff:fe2a:37ac/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:38 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:6324 (6.3 KB)
```

## Thoughts

Of course this could be seen as a hindrance if you have an environment
more complex than just assigning vlan tags to `eth0`. Automating the
assignment of vlan's is probably best done within the installer,
however, that feature doesn't exist. Some things that could be done to
lessen the administrative burden would be making use of puppet on the
MAAS server and pre-populating the `/etc/maas/preseeds/generic` file.

## Cool tips

If you are running your MAAS instance and nodes within
KVM/VirtualBox/etc you could easily pull the IP from the virtual
machine if you know the MAC address using something like `arp
-an`. Then either setup puppet to keep your preseeds updated or
utilize something like [libguestfs](http://libguestfs.org/) to make
changes directly within the VM.

## Troubleshooting

Installing this on a desktop image with NetworkManager running (first
ask yourself why)? Then
[see this post](http://askubuntu.com/questions/199254/802-1q-vlan-interface-configuration-on-ubuntu-12-04-desktop)
for a solution to configuring NetworkManager and vlan's.
