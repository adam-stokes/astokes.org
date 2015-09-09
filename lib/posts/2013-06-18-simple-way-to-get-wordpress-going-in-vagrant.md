---
layout: post.jade
title: Simple way to get wordpress going in vagrant
author: Adam Stokes
date: 2013-06-18T22:06Z
tags: [wordpress, vagrant]
---
<p>Im working on some wordpress stuff recently and realized how much I dislike<br />
setting up php development environments. Specifically anything prior to php 5.4<br />
because of the lack of a built in web server.</p>
<p>I decided at this point it is a good time to invest some time into <a href=&#34;http://vagrantup.com&#34;>vagrant</a> and<br />
attempt to get a more tolerable way of hacking on anything php. I managed to<br />
come across a <a href=&#34;https://github.com/chad-thompson/vagrantpress&#34;>github project</a> that allows me to setup a vagrant session and have<br />
wordpress installed and configured with no fuss.</p>
<p>Fortunately, the developer is receptive to pull requests and merged a few of my<br />
additions to make this project a great way to get started with wordpress<br />
easily.</p>
<p>Here are the simple steps to getting a wordpress development environment setup<br />
in Ubuntu Precise (12.04) and on your way to hacking a new exciting plugin :)</p>
<p>First install VirtualBox</p>
<pre class=&#34;prettyprint&#34;>
$ sudo apt-get install virtualbox
</pre>
<p>Install <a href=&#34;http://vagrantup.com&#34;>vagrant</a> from their site. Once that is done follow the next steps to<br />
get up and running.</p>
<pre class=&#34;prettyprint&#34;>
$ git clone https://github.com/chad-thompson/vagrantpress.git
$ cd vagrantpress
$ vagrant up
</pre>
<p>You can view your wordpress installation at </p>
<pre class=&#34;prettyprint&#34;>
http://localhost:8080/wordpress
# or for a more fqdn approach
http://lvh.me:8080/wordpress
</pre>
