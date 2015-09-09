---
title: 'Customizing the Single Install constraints'
date: 2015-02-18T03:42Z
featured: openstack.png
tags: ubuntu, openstack, juju
template: single.hbs
---

# Overview

Sometimes our default constraints for a Single Installation isn't enough. With our latest release it is possible to now configure the service placements with custom constraints.

Below is a fully working config example that you can modify to suit your hardware:

## Example

```yaml
install_type: Single
placements:
  controller:
    assignments:
      LXC:
      - nova-cloud-controller
      - glance
      - glance-simplestreams-sync
      - openstack-dashboard
      - juju-gui
      - keystone
      - mysql
      - neutron-api
      - neutron-openvswitch
      - rabbitmq-server
      - swift-proxy
    constraints:
      cpu-cores: 2
      mem: 6144
      root-disk: 20480
  nova-compute-machine-0:
    assignments:
      BareMetal:
      - nova-compute
    constraints:
      mem: 4096
      root-disk: 40960
  quantum-gateway-machine-0:
    assignments:
      BareMetal:
      - quantum-gateway
    constraints:
      mem: 2048
      root-disk: 20480
  swift-storage-machine-0:
    assignments:
      BareMetal:
      - swift-storage
    constraints: &id001 {}
  swift-storage-machine-1:
    assignments:
      BareMetal:
      - swift-storage
    constraints: *id001
  swift-storage-machine-2:
    assignments:
      BareMetal:
      - swift-storage
    constraints: *id001
```

Looking under the constraints for the **controller** you can expand on
the disk storage, memory, and cpus that will be allocated to that
service during deployment.

### To make use of this config run:

```bash
$ sudo openstack-install -c config.yaml
```
It'll walk you through setting a password and selecting the Single
install mode. Once the installer is to the point of deployment it'll
automatically pickup your placements configuration and deploy based on
those updated constraints.

Head over to
[Single installer guide](http://ubuntu-cloud-installer.readthedocs.org/en/testing/single-installer.guide.html)
for more information. Also if you find bugs or have a feature request
please check out our
[GitHub project](https://github.com/Ubuntu-Solutions-Engineering/openstack-installer)!
