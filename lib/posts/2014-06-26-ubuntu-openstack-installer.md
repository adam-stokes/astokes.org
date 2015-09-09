---
template: single.hbs
title: Ubuntu Openstack Installer
author: Adam Stokes
date: 2014-06-26T12:40Z
featured: openstack.png
tags: openstack, ubuntu
---
As the title suggests this little gem is an OpenStack installer tailored specifically to get you from zero to hero in just a short amount of time.

There are a few options available today for deploying an OpenStack cloud. For instance, [juju-deployer](http://pythonhosted.org/juju-deployer/) with an OpenStack specific bundle or that other thing called [devstack](http://devstack.org/). While these technologies work we wanted to take our existing technologies and go a step further. A lot of people may not have 10 systems laying around to utilize juju-deployer or you may be wanting to demonstrate to the powers that be that implementing Ubuntu, Juju, MAAS, and OpenStack within your company is a great idea. Of course you could bring one of those shiny orange boxes or a handful of Intel NUCS into the conference room _or_ ..

.. install the Ubuntu OpenStack Installer and get a cloud to play with on a single machine. Getting started is ez-pz.

## Requirements

*   Decent machine, tested on a machine with 8 cores, 12G ram, and 100G HDD.
*   Ubuntu Trusty 14.04
*   Juju 1.20.x (includes support for lxc fast cloning for multiple providers)
*   About 30 minutes of your time.

## First

Add the **ppa** and install the software.

```bash
    $ sudo apt-add-repository ppa:cloud-installer/testing
    $ sudo apt-get update
    $ sudo apt-get install openstack
```

## Second

Run it.

`$ sudo openstack-install`

You'll first be asked for an OpenStack password, this can be anything of your choosing and will be the password used throughout the rest of the install and also the password used for logging into various services (Horizon, Juju GUI, Landscape)

## Third

You're presented with 3 options, a **Single**, **Multi**, and **Landscape OpenStack Autopilot**. Select **Single**.

## Post

The installer will go through its little routine of installing necessary packages and setting up configuration. Once this is complete you'll be dropped into a _status screen_ which will then begin the magical journey of getting you setup with a fully functioning OpenStack cloud.

# Is that all?

Yep, to elaborate a bit I'll explain what's happening:

The entire stack is running off a single machine in a single **LXC** container. Having the deployment within a container allows for an undestructive way to test out a new OpenStack deployment as cleaning up is a matter of removing the container or uninstalling the _openstack_ package. Juju is heavily utilized for its ability to deploy services, setup relations, and configure those services. Similar to what juju-deployer does. What juju-deployer doesn't do is automatically sync boot images via simplestreams or automatically configure neutron to have all deployed instances within nova-compute available on the same network as the host machine all while using a single network card. We even throw in **juju-gui** for good measure :D.

The experience we are trying to achieve is that any one person can sit down at a machine and have a complete end to end working Openstack environment. All while keeping your gray hair at a minimum and your budget intact. Heres a screenshot of our nifty console ui:

## Verify

Verifying your cloud is easy, just go through the process of deploying an instance via Horizon (Openstack Dashboard), associating a floating IP (already created for you just need to select one) and ssh into the newly created instance to deploy your software stack. Depending on bandwidth some images may not be immediately available and may require you to wait a little longer.

## What about those other install options?

Well, as I stated before we have a lot of cool technologies out there like MAAS. That is what the **Multi Install** is for. The cool thing about this is you install it the same way you would a **Single Install**. Fast-forward past the package installing and to the status screen you'll be presented with a dialog stating to PXE boot a machine to act as the controller. Our installer tries to do everything for you but some things are left up to you. In this case you'd commission a machine in the MAAS environment and get it into a ready state. From there the Installer will pick up that machine and continue on its merry way as it did during the single installation.

One thing to note is you'll want to have a few machines whether it be bare metal or virtual registered in MAAS to make use of all the installer has to offer. I was able to get a full cloud deployed on 3 machines, 1 bare metal (the host machine running maas), 2 virtual machines registered in MAAS. Keep in mind there were no additional network devices added as the installer can configure neutron on a single NIC :)

## Where to go from here?

If you need swift storage for your glance images hit **(F6)** in the status screen and select **Swift storage**. This will deploy the necessary bits for swift-storage to be integrated into your Openstack cloud. Swift storage requires at least 3 nodes (in the single install this would be 3 VMs) so make sure you've got the hardware for this. Otherwise, for developing/toying around with Openstack leaving the defaults works just as good.

This is just an intro into the installer more documentation can be found @ [ReadTheDocs](http://ubuntu-cloud-installer.readthedocs.org/en/latest/index.html). The project is hosted @ [GitHub](https://github.com/Ubuntu-Solutions-Engineering/cloud-installer) and we definitely encourage you to star it, fork it, file issues, and contribute back to make this a truly enjoyable experience. If you need help please come talk to us on IRC @ freenode.net/#ubuntu-solutions.
