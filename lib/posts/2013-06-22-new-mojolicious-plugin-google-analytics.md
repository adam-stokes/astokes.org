---
layout: post.jade
status: publish
published: true
title: 'New Mojolicious plugin: Google Analytics'
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 90
wordpress_url: http://beta.astokes.org/new-mojolicious-plugin-google-analytics/
date: 2013-06-22T02:33Z
categories:
- What's New
- Coder
- perl
tags:
- cms
- blog
- library
---
<p>A new plugin up on cpan for making it easy to add your Google Analytics<br />
tracking code. </p>
<p>To get started just include the plugin in your Mojolicious web application and<br />
use the builtin helper.</p>
<h3 id=&#34;installation&#34;>Installation</h3>
<pre><code>  $ cpanm Mojolicious::Plugin::GoogleAnalytics
</code></pre>
<h3 id=&#34;example&#34;>Example</h3>
<pre><code>  # Mojolicious
  $self-&#38;gt;plugin(&#39;GoogleAnalytics&#39;);

  # Mojolicious::Lite
  plugin &#39;GoogleAnalytics&#39;;

  # In your layout template just before closing head tag
  &#38;lt;%= analytics_inc &#39;UA-32432-1&#39; %&#38;gt;
</code></pre>
<p>Hopefully, that&#39;ll save some few extra lines of typing :D</p>
