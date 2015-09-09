---
layout: post.jade
status: publish
published: true
title: 'New mojolicious plugin: leaflet.js'
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 81
wordpress_url: http://beta.astokes.org/new-mojolicious-plugin-leaflet-js/
date: 2013-09-05T02:40Z
categories:
- What's New
- Coder
- perl
- javascript
tags:
- perl
- leaflet
- web
- javascript
- cms
- blog
- library
---
<p>Started working on a new Mojolicious plugin for integrating the popular javascript mapping library <a href="http://leafletjs.com">leaflet.js</a>. You can find it on <a href="https://metacpan.org/release/ADAMJS/Mojolicious-Plugin-Leafletjs-0.001">metacpan</a> or help with contributions at the <a href="https://github.com/battlemidget/Mojolicious-Plugin-Leafletjs">github project page</a>.</p>
<p>A quick synopsis of how to use it:</p>
<pre><code># Mojolicious
$self-&gt;plugin('Leafletjs');

# Mojolicious::Lite
plugin 'Leafletjs';

# In your template
&lt;%= leaflet {
  name      =&gt; 'map1',
  latitude =&gt; '35.9239',
  longitude  =&gt; '-78.4611',
  zoomLevel =&gt; 18,
  markers   =&gt; [
    {   name      =&gt; 'marker1',
        latitude =&gt; '35.9239',
        longitude  =&gt; '-78.4611',
        popup     =&gt; 'A new message tada!',
    },
    {   name      =&gt; 'marker2',
        latitude =&gt; '35.9235',
        longitude  =&gt; '-78.4610',
        popup     =&gt; 'A second popup here!',
    }
  ],
}
%&gt;
</code></pre>
<p>An example of a Mojolicious Lite application can be found in <a href="https://github.com/battlemidget/Mojolicious-Plugin-Leafletjs/tree/master/eg">the examples directory on github</a></p>
