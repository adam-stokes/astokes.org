---
layout: post.jade
status: publish
published: true
title: vimntu; easiest way to get up and running with vim
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 85
wordpress_url: http://beta.astokes.org/vimntu-easiest-way-to-get-up-and-running-with-vim/
date: 2013-08-20T20:14Z
categories:
- Coder
- Software
- VIM
- Shellscript
tags:
- perl
- vim
- cms
- blog
- library
---
<p>I've spent some time working on a <a href="https://github.com/battlemidget/vimntu">stupid simple script</a> that would install latest snapshot of VIM along with <a href="https://github.com/carlhuda/janus">janus</a> and my additional plugins. It's really easy to get started, to install simply run:</p>
<pre><code>$ curl -L https://github.com/battlemidget/vimntu/raw/master/vimntu | bash
</code></pre>
<p>You get all the modifications from <a href="https://github.com/carlhuda/janus">janus</a> in addition to an extensive set of plugins activated through pathogen that gives extensive support to most of the major programming languages.</p>
