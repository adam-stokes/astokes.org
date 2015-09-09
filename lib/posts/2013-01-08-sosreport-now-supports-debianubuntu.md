---
layout: post.jade
title: SOSreport now supports Debian/Ubuntu
author: Adam Stokes
date: 2013-01-08T15:00Z
tags: [ubuntu, linux, sosreport]
---
<p>Sosreport is a set of tools is designed to provide information to support organizations<br />
in an extensible manner, allowing third parties, package maintainers, and<br />
anyone else to provide plugins that will collect and report information that<br />
is useful for supporting software packages.</p>
<p>This project is hosted at <a href=&#34;http://github.com/sosreport/sosreport&#34;>Github</a> For the latest<br />
version, to contribute, and for more information, please visit there.</p>
<p>Installing it through Launchpad PPA:</p>
<pre class=&#34;prettyprint&#34;>
    sudo add-apt-repository ppa:debugmonkeys/sosreport
    sudo apt-get update
    sudo apt-get install sosreport
</pre>
<p>If you are coming from a Red Hat Enterprise Linux or Fedora background and are familiar with sosreport we&#39;d like to invite you to participate in porting over plugins to work across these distributions as well. Several plugins have been ported over that you can use as a guide for making other plugins distribution aware.</p>
