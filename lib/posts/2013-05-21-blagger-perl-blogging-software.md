---
layout: post.jade
title: blagger - perl blogging software
author: Adam Stokes
date: 2013-05-21T02:13Z
tags: [cms, blog, perl]
---
<p>I was using octopress for awhile but I still have mixed feelings about<br />
ruby. There isn&#39;t anything wrong with ruby, but, as the creator of<br />
ruby said &#34;its how you feel when writing in a language&#34; and I don&#39;t<br />
think me and ruby are on the same page.</p>
<p>I started looking around for a simple one file blogging system with<br />
minimal dependencies and could be extended easily. I attempted to<br />
write my own with using a cpan package called fatpacker. The idea<br />
behind it is cool, however, I couldn&#39;t get it to fully work with the<br />
modules I needed. I scratched that project the first day and just<br />
happened to stumble across <a href=&#34;https://github.com/avenj/blagger&#34;>blagger</a>. It is relatively new and<br />
doesn&#39;t have a lot of features (which I believe was the authors<br />
point).</p>
<p>What got me interested was it is written in Perl, easy to hack on, and<br />
has a small amount of dependencies. It uses Mojolicious as a web<br />
framework which allowed me to put all code and templates within the<br />
blagger file. The code itself is well written and allowed me to get up<br />
to speed on the design quickly.</p>
<p>I&#39;ve converted my current blog to <a href=&#34;https://github.com/battlemidget/blagger&#34;>blagger with my own<br />
modifications</a>. Some additional features include:</p>
<ul>
<li>Categories</li>
<li>RSS Feeds for /*/:category/atom.xml and the root path for all<br />
articles.</li>
<li>Generates posts with YYYY/MM/DD prepended (keeps everything in a<br />
good order)</li>
<li>Gravatar support (elementary, could stand to use something other<br />
than hard coded urls :))</li>
</ul>
<p>Some things I plan on adding</p>
<ul>
<li>gist support</li>
<li>syntax highlighter</li>
</ul>
<p>I don&#39;t plan on adding much more than the bare minimum for someone who<br />
writes about coding projects and an occasional rant. Patches are<br />
definately welcomed.</p>
