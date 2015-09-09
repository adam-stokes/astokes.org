---
template: post.jade
title: New Mojolicious plugin - Disqus::Tiny
author: Adam Stokes
date: 2013-07-01T14:11Z
tags:
- cms
- blog
- library
---
<p>Another small plugin for easing inclusion of socially enabled software. This<br />
plugin only concentrates on including the necessary javascript code to get<br />
comments enabled on your blog or web app.<br />
<a href=&#34;https://metacpan.org/module/Mojolicious::Plugin::Disqus&#34;>Mojolicious::Plugin::Disqus</a> gives you more control over the api if you need<br />
more options.</p>
<p>A quick example on setting up your disqus forum on a mojolicious app:</p>
<pre><code>  #!/usr/bin/env perl
  use Mojolicious::Lite;

  plugin &#39;Disqus::Tiny&#39;;

  get &#39;/&#39; =&#38;gt; sub {
    my $self = shift;
    $self-&#38;gt;render(&#39;index&#39;);
  };

  app-&#38;gt;start;
  __DATA__

  @@ index.html.ep
  Welcome to the Mojolicious real-time web framework!

  &#38;lt;%= disqus_inc &#39;astokes&#39; %&#38;gt;
</code></pre>
<p>You can find the module on <a href=&#34;https://metacpan.org/module/Mojolicious::Plugin::Disqus::Tiny&#34;>cpan</a> and code repository on <a href=&#34;https://github.com/battlemidget/Mojolicious-Plugin-Disqus-Tiny&#34;>github</a>.</p>
