---
layout: post.jade
title: Using fastpath installer in MAAS
date: 2013-10-08T17:04Z
featured: maas.png
tags:
- maas
- fastpath
- curtin
- kvm
---

MAAS 1.4 supports installing images via
[curtin](http://launchpad.net/curtin) (fastpath).

To enable fastpath for a node we need to
[tag](http://maas.ubuntu.com/docs/tags.html) it with
`use-fastpath-installer` that is understood by MAAS and fastpath. As
far as I can tell this has to be accomplished via `maas-cli`.

## Set your MAAS profile

If you've gone through the
[basic getting started steps](http://maas.ubuntu.com/docs/install.html)
with MAAS your profile is most likely `maas`. Assign `MAASNAME` to
your `maas` profile.

```
ubuntu@maas:~$ MAASNAME=maas
```

## Login to your MAAS instance via maas-cli

In order to login to your maas instance you'll need to grab your
**maas-key**. This can be done by visiting the user preferences page
(http://maas.ip/MAAS/account/prefs) or clicking the `preferences` link
under your account name (Fig 1).

![Fig 1. User preferences](/images/2013/10/figure_8a.png)

Your **maas-key** should be located under the _MAAS keys_ section (Fig 2)

![Fig 2. MAAS keys](/images/2013/10/figure_9a.png)

Once you have that key copied,
[login](http://maas.ubuntu.com/docs/maascli.html#api-key) to your MAAS
instance from the command line.

```
ubuntu@maas:~$ maas-cli login maas http://192.168.122.206/MAAS/api/1.0 CNTvmLmstUadGLk4wp:nxcJ9LZnCmksRe2jFS:xAYeYj4yJdJ4ARsfGBxWYSgqzsMtJbcF

You are now logged in to the MAAS server at
http://192.168.122.206/MAAS/api/1.0/ with the profile name 'maas'.

For help with the available commands, try:

    maas-cli maas --help

ubuntu@maas:~$
```

## Apply the tag to a single node

Once logged in we can start tagging nodes. In order to figure out which node you'd like to tag run the following command:

```
ubuntu@maas:~$ maas-cli maas nodes list
    [
        {
            "status": 4,
            "macaddress_set": [
                {
                    "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/macs/52:54:00:2a:37:ac/",
                    "mac_address": "52:54:00:2a:37:ac"
                }
            ],
            "hostname": "node1.master",
            "power_type": "virsh",
            "routers": [],
            "netboot": true,
            "cpu_count": 1,
            "storage": 0,
            "system_id": "node-1a62d358-2f8e-11e3-b5c3-525400a1c422",
            "architecture": "amd64/generic",
            "memory": 512,
            "owner": null,
            "tag_names": [
                "virtual"
            ],
            "ip_addresses": [
                "192.168.122.101"
            ],
            "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/"
        }
    ]
```

If you look at `system_id` this will be what you'll use when tagging a single node. Go ahead and store that node in a variable

```
ubuntu@maas:~$ node=node-1a62d358-2f8e-11e3-b5c3-525400a1c422
```

At this point the `use-fastpath-installer` tag doesn't exist so we need to create it first

```
ubuntu@maas:~$ maas-cli $MAASNAME tags new name='use-fastpath-installer' comment='fp'
    {
        "comment": "fp",
        "definition": "",
        "resource_uri": "/MAAS/api/1.0/tags/use-fastpath-installer/",
        "name": "use-fastpath-installer",
        "kernel_opts": ""
    }
```

Now we can apply the tag to the node

```
ubuntu@maas:~$ maas-cli $MAASNAME tag update-nodes use-fastpath-installer add=$node
    {
        "removed": 0,
        "added": 1
    }
```

Or you can run the following command and bypass creating the tag and applying it manually to a node with the following

```
ubuntu@maas:~$ maas-cli $MAASNAME tags new name='use-fastpath-installer' comment='fp' "definition=true()"
```

This will create the `use-fastpath-installer` tag and apply to all available nodes.

## Verify your node(s) are tagged

You can view that the tagging worked by either running the following command:

```
ubuntu@maas:~$ maas-cli $MAASNAME tag nodes use-fastpath-installer
    [
        {
            "status": 4,
            "macaddress_set": [
                {
                    "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/macs/52:54:00:2a:37:ac/",
                    "mac_address": "52:54:00:2a:37:ac"
                }
            ],
            "hostname": "node1.master",
            "power_type": "virsh",
            "routers": [],
            "netboot": true,
            "cpu_count": 1,
            "storage": 0,
            "system_id": "node-1a62d358-2f8e-11e3-b5c3-525400a1c422",
            "architecture": "amd64/generic",
            "memory": 512,
            "owner": null,
            "tag_names": [
                "virtual",
                "use-fastpath-installer"
            ],
            "ip_addresses": [
                "192.168.122.101"
            ],
            "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/"
        }
    ]
```

Or through the **web-ui** and viewing your node properties (Fig. 3)

![Fig 3. Node properties](/images/2013/10/figure_10a.png)

## Deploy your node with fastpath installer

Now that the node is tagged simply re-deploy the node and fastpath
should take over automatically. Should note that you really won't see
a difference other than speed increase of the installation, but, let's
be honest that's really what we care about right? :)

## Tips

I ran this test on **Precise** in order to do that you'll need the
_cloud-tools_ pocket in the **cloud archive**:

```
ubuntu@hostmachine:~$ sudo apt-get install -qy ubuntu-cloud-keyring </dev/null
ubuntu@hostmachine:~$ sudo tee /etc/apt/sources.list.d/cloud-tools-precise.list <<EOF
deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
deb-src http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
EOF
```
