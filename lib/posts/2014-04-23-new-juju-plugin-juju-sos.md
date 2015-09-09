---
layout: post.jade
title: 'new juju plugin: juju-sos'
author: Adam Stokes
date: 2014-04-23T05:52Z
featured: juju.svg
tags: ubuntu, juju
---
[Juju sos](https://github.com/battlemidget/juju-sos) is my entryway into Go code and the juju internals. This plugin will execute and pull [sosreports](https://github.com/sosreport/sos) from all machines known to juju or a specific machine of your choice and copy them locally on your machine.

An example of what this plugin does, first, some output of `juju status` to give you an idea of the machines I have:

    ┌[poe@cloudymeatballs] [/dev/pts/1] 
    └[~]> juju status
    environment: local
    machines:
      "0":
        agent-state: started
        agent-version: 1.18.1.1
        dns-name: localhost
        instance-id: localhost
        series: trusty
      "1":
        agent-state: started
        agent-version: 1.18.1.1
        dns-name: 10.0.3.27
        instance-id: poe-local-machine-1
        series: trusty
        hardware: arch=amd64 cpu-cores=1 mem=2048M root-disk=8192M
      "2":
        agent-state: started
        agent-version: 1.18.1.1
        dns-name: 10.0.3.19
        instance-id: poe-local-machine-2
        series: trusty
        hardware: arch=amd64 cpu-cores=1 mem=2048M root-disk=8192M
    services:
      keystone:
        charm: cs:trusty/keystone-2
        exposed: false
        relations:
          cluster:
          - keystone
          identity-service:
          - openstack-dashboard
        units:
          keystone/0:
            agent-state: started
            agent-version: 1.18.1.1
            machine: "2"
            public-address: 10.0.3.19
      openstack-dashboard:
        charm: cs:trusty/openstack-dashboard-0
        exposed: false
        relations:
          cluster:
          - openstack-dashboard
          identity-service:
          - keystone
        units:
          openstack-dashboard/0:
            agent-state: started
            agent-version: 1.18.1.1
            machine: "1"
            open-ports:
            - 80/tcp
            - 443/tcp
            public-address: 10.0.3.27

Basically what we are looking at is 2 machines that are running various services on them in my case **Openstack Horizon** and **Keystone**. Now suppose I have some issues with my juju machines and openstack and I need a quick way to gather a bunch of data on those machines and send them to someone who can help. With my [juju-sos plugin](https://github.com/battlemidget/juju-sos), I can quickly gather sosreports on each of the machines I care about in as little typing as possible.

Here is the output from `juju sos` querying all machines known to juju:

```bash
┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]> juju sos -d ~/scratch
2014-04-23 05:30:47 INFO juju.provider.local environprovider.go:40 opening environment "local"
2014-04-23 05:30:47 INFO juju.state open.go:81 opening state, mongo addresses: ["10.0.3.1:37017"]; entity ""
2014-04-23 05:30:47 INFO juju.state open.go:133 dialled mongo successfully
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:53 Querying all machines
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:59 Adding machine(1)
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:59 Adding machine(2)
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:88 Capturing sosreport for machine 1
2014-04-23 05:30:55 INFO juju.sos main.go:119 Copying archive to "/home/poe/scratch"
2014-04-23 05:30:56 INFO juju.sos.cmd cmd.go:88 Capturing sosreport for machine 2
2014-04-23 05:31:08 INFO juju.sos main.go:119 Copying archive to "/home/poe/scratch"

┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]> ls $HOME/scratch
sosreport-ubuntu-20140423040507.tar.xz  sosreport-ubuntu-20140423052125.tar.xz  sosreport-ubuntu-20140423052545.tar.xz
sosreport-ubuntu-20140423050401.tar.xz  sosreport-ubuntu-20140423052223.tar.xz  sosreport-ubuntu-20140423052600.tar.xz
sosreport-ubuntu-20140423050727.tar.xz  sosreport-ubuntu-20140423052330.tar.xz  sosreport-ubuntu-20140423052610.tar.xz
sosreport-ubuntu-20140423051436.tar.xz  sosreport-ubuntu-20140423052348.tar.xz  sosreport-ubuntu-20140423053052.tar.xz
sosreport-ubuntu-20140423051635.tar.xz  sosreport-ubuntu-20140423052450.tar.xz  sosreport-ubuntu-20140423053101.tar.xz
sosreport-ubuntu-20140423052006.tar.xz  sosreport-ubuntu-20140423052532.tar.xz
```

Another example of `juju sos` just capturing a sosreport from one machine:

```bash
┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]> juju sos -d ~/scratch -m 2
2014-04-23 05:41:59 INFO juju.provider.local environprovider.go:40 opening environment "local"
2014-04-23 05:42:00 INFO juju.state open.go:81 opening state, mongo addresses: ["10.0.3.1:37017"]; entity ""
2014-04-23 05:42:00 INFO juju.state open.go:133 dialled mongo successfully
2014-04-23 05:42:00 INFO juju.sos.cmd cmd.go:70 Querying one machine(2)
2014-04-23 05:42:00 INFO juju.sos.cmd cmd.go:88 Capturing sosreport for machine 2
2014-04-23 05:42:08 INFO juju.sos main.go:99 Copying archive to "/home/poe/scratch"
```

Fancy, fancy :)

Of course this is a _work in progress_ and I have a few ideas of what else to add here, some of those being:

*   Rename the sosreports to match the dns-name of the juju machine
*   Filter sosreport captures based on services
*   Optionally pass arguments to sosreport command in order to filter out specific plugins I want to run, ie

    `$ juju sos -d ~/sosreport -- -b -o juju,maas,nova-compute`

As usual contributions are welcomed and some installation instructions are located in the [readme](https://github.com/battlemidget/juju-sos/blob/master/README.md)
