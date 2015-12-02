Sometimes it is just quicker to type a few commands on the cli than opening your
browser window, going to https://jujucharms.com and typing out a search term to
see what is available to you. So I wrote a tiny plugin to speed that up a bit.

## Install the plugin

> Currently supports Trusty, Vivid, and Wily

```
$ sudo apt-add-repository ppa:adam-stokes/juju-query
$ sudo apt-get update
$ sudo apt-get install juju-query
```

## Searching the charmstore

If you know the exact name of the charm:
```
$ juju search ghost
```

Results in
```
Precise

 cs:precise/ghost-3

Example:

 juju deploy cs:precise/ghost-3

Get additional information:

 juju info cs:precise/ghost-3

```


Or part of a charm name
```
$ juju search nova-cloud\*
```
Gives us
```
Trusty

 cs:trusty/nova-cloud-controller-64

Precise

 cs:precise/nova-cloud-controller-55

Namespaced

 cs:~landscape/trusty/nova-cloud-controller-6
 cs:~landscape/trusty/nova-cloud-controller-next-49
 cs:~openstack-charmers-next/trusty/nova-cloud-controller-17
 cs:~cory-benfield/trusty/nova-cloud-controller-10
 cs:~andybavier/trusty/nova-cloud-controller-3
 cs:~mmenkhof/trusty/nova-cloud-controller-1
 cs:~plumgrid-team/trusty/nova-cloud-controller-0
 cs:~adam-collard/trusty/nova-cloud-controller-0
 cs:~bjornt/trusty/nova-cloud-controller-1
 cs:~chad.smith/trusty/nova-cloud-controller-0
 cs:~project-calico/trusty/nova-cloud-controller-0
 cs:~landscape/trusty/nova-cloud-controller-stable-integrityerror-1
 cs:~niedbalski/trusty/nova-cloud-controller-0
 cs:~celebdor/trusty/nova-cloud-controller-1
 cs:~landscape/trusty/nova-cloud-controller-leadership-election-0
 cs:~nuage-canonical/trusty/nova-cloud-controller-1
 cs:~le-charmers/trusty/nova-cloud-controller-0
 cs:~openstack-ubuntu-testing/precise/nova-cloud-controller-38
 cs:~charmers/precise/nova-cloud-controller-27
 cs:~springfield-team/precise/nova-cloud-controller-11
 cs:~gandelman-a/precise/nova-cloud-controller-2
 cs:~ivoks/precise/nova-cloud-controler-0

Example:

 juju deploy cs:~landscape/trusty/nova-cloud-controller-6

Get additional information:

 juju info cs:~landscape/trusty/nova-cloud-controller-6

```

## Getting more information

This will give you the output of the **README** stored on https://jujucharms.com
```
$ juju info ghost|less
```

And the output of the README right to your screen \o/

```
ghost

Ghost is a simple, powerful publishing platform.

README

# Overview

Ghost is an Open Source application which allows you to write and publish your
own blog, giving you the tools to make it easy and even fun to do. It's simple,
elegant, and designed so that you can spend less time making your blog work and
more time blogging.

This is an updated charm originally written by Jeff Pihach and ported over to
the charms.reactive framework and updated for Trusty and the latest Ghost
release.

# Quick Start

After you have a Juju cloud environment running:

    $ juju deploy ghost
    $ juju expose ghost

To access your newly installed blog you'll need to get the IP of the instance.

    $ juju status ghost

Visit `<your URL>:2368/ghost/` to create your username and password.
Continue setting up Ghost by following the
[usage documentation](http://docs.ghost.org/usage/).

You will want to change the URL that Ghost uses to generate links internally to
the URL you will be using for your blog.

    $ juju set ghost url=<your url>

# Configuration

To view the configuration options for this charm open the `config.yaml` file or:

    $ juju get ghost
```

This plugin utilizes `theblues` python library for interfacing with the
charmstore's api. Check out the project [on their github
page](https://github.com/juju/theblues).

If you want to contribute to the plugin you can find that on my [github
page](https://github.com/battlemidget/juju-query). Some other features I'd like
to add is getting the configuration options, searching bundles, show what
relations are provided/required, etc.
