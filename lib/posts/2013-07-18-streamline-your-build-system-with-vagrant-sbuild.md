---
layout: post.jade
title: Streamline your build system with vagrant + sbuild
date: 2013-07-18T21:21Z
tags:
- ubuntu
- linux
- sbuild
- vagrant
---
Remembering what to do in order to get your sbuild environment setup
with deb caching and configuring Barry Warsaws repotools for those
packages not in the archive can be a little tedious at times.

For me I hated upgrading my systems knowing I had to re-setup my
sbuild environments.

In order to streamline this I created a project to help package
builders take some of these boilerplate stuff out of the way and just
create the schroot and start your build.

This vagrant project was modeled after
[SbuildSimple](https://wiki.ubuntu.com/SimpleSbuild). Please check
there for additional information on local packages.

You can find the project at
[github](https://github.com/battlemidget/vagrant-sbuild)

## Features

*   supports lxc and virtualbox
*   apt package caching for quicker builds
*   automatically set maxcpus available to sbuild
*   supports building packages against newer/custom local packages

Using it is fairly simple:

## Setup

Install virtualbox

`$ sudo apt-get install virtualbox`

Install [vagrant](http://downloads.vagrantup.com/)

Install vagrant-sbuild

```bash
$ git clone git://github.com:battlemidget/vagrant-sbuild.git
$ cd vagrant-sbuild
$ git submodule init
$ git submodule update
```

Install [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc)

`$ vagrant plugin install vagrant-lxc`

Set some environment variables

`export DEBEMAIL=Your Name < hi2u@mail.com > export DEBSIGN_KEY=123134`

### Optional

Install [vagrant-cachier](https://github.com/fgrehm/vagrant-cachier) for improved performance

`$ vagrant plugin install vagrant-cachier`

**Note**: I havent personally tested this as apt-cacher-ng is running
  for builds, however, for the provisioning itself it may be
  beneficial if you are doing a lot of provisioning. Make sure you
  read the **Vagrantfile** and uncomment the section that enables the
  auto caching feature.

## Vagrant boxes

A list of lxc supported vagrant boxes can be found at the
[Vagrant LXC wiki](https://github.com/fgrehm/vagrant-lxc/wiki/Base-boxes)
page.

## Usage

`$ vagrant up`

## Create sbuild environments

`$ vagrant mk-sbuild --series saucy`

## Perform builds

`$ vagrant sbuild --project saucy-amd64 --dsc scratch/PACKAGE\*.dsc`

If packages are required that are not in the archive you may place
them in the **repo/** directory and they will be included in any
future builds.

Once complete the build packages should be in your **scratch/**
directory and not once did you have to ssh into your vagrant box :D

## Todo's

*   setup vagrant multi-machine for each series
*   include a config.yaml file for setting your debian maintainer info and other necessities.
