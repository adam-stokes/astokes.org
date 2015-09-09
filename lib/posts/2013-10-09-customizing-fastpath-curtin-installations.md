---
layout: post.jade
title: Customizing fastpath (curtin) installations in MAAS
featured: maas.png
date: 2013-10-09T18:49Z
tags: python, fastpath, maas, curtin
---
Working off my previous entry about
**[using fastpath installer in MAAS](http://astokes.org/using-fastpath-installer-maas/)**
I decided to dig a little deeper into customizing those installations
a bit. One thing to note is
[fastpath(curtin/curt installer)](http://launchpad.net/curtin)
installations do not follow the same guidelines that are used in
preseed files for Debian installer. Some overview documentation of
[fastpath can be located here](http://bazaar.launchpad.net/~curtin-dev/curtin/trunk/view/head:/doc/topics/overview.rst)
and thanks to [Scott Moser](http://ubuntu-smoser.blogspot.com/) we
were able to come up with the following example scenario.

## Example scenario

**Setting up vlans during a fastpath installation.**

On the **[MAAS](http://maas.ubuntu.com)** server edit
`/etc/maas/preseeds/curtin_userdata` and write the following
(substituting your vlan configuration):

```yaml
# vlan config
bucket:
  &myinterfaces |
   # This file describes the network interfaces available on your system
   # and how to activate them. For more information, see interfaces(5).

   # The loopback network interface
   auto lo
   iface lo inet loopback

   # The primary network interface
   auto eth0
   iface eth0 inet dhcp
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

#cloud-config
debconf_selections:
 maas: |
  {{for line in str(curtin_preseed).splitlines()}}
  {{line}}
  {{endfor}}
early_commands:
  update: apt-get update
  vlan: apt-get install vlan -q -y

late_commands:
  maas: [wget, '--no-proxy', '{{node_disable_pxe_url|escape.shell}}', '--post-data', '{{node_disable_pxe_data|escape.shell}}', '-O', '/dev/null']
  load_8021q: ['sh', '-c', 'echo 8021q >> $TARGET_MOUNT_POINT/etc/modules']

network_commands:
  vlans: ['sh', '-c', 'printf "$1" > "$OUTPUT_INTERFACES"', '--', *myinterfaces]

power_state:
  mode: reboot

{{if node.architecture in {'i386/generic', 'amd64/generic'} }}
apt_mirror: http://{{main_archive_hostname}}/{{main_archive_directory}}
{{else}}
apt_mirror: http://{{ports_archive_hostname}}/{{ports_archive_directory}}
{{endif}}

{{if http_proxy }}
apt_proxy: {{http_proxy}}
{{else}}
apt_proxy: http://{{server_host}}:8000/
{{endif}}
```

Once your node is deployed simply ssh into the instance and verify the
`8021q` module is loaded and that `ifconfig` reports your added vlans.

Our `lsmod` output shows the proper module loaded

```
ubuntu@node1:~$ lsmod|grep 8021q
8021q                  24084  0 
garp                   14602  1 8021q
```

`/etc/network/interfaces` shows the correct vlan information

```
auto lo
iface lo inet loopback
auto eth0
iface eth0 inet dhcp
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
```

## Notes

***curtin_userdata*** is a YAML file so any thing that applies to the YAML
1.2 specification should work here. For example, you'll notice
***&myinterfaces*** and __*myinterfaces__, these are node anchors more
commonly called references for repeating YAML items. See
[this wikipedia page](http://en.wikipedia.org/wiki/YAML#References)
for more information and the
[YAML spec](http://www.yaml.org/spec/1.2/spec.html).
