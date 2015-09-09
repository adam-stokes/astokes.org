---
layout: post.jade
title: Deploy blagger with starman, rex and ubic
author: Adam Stokes
date: 2013-05-23T15:24Z
tags: [cms, blog, perl]
---
<p>If you come from a python or ruby background and are used to services<br />
such as virtualenv, rbenv then this document should be easy to<br />
follow. If not, no problem it is still easy :)</p>
<h2 id=&#34;pre-reqs&#34;>Pre-reqs</h2>
<p>Youll want to install perlbrew which is perl&#39;s equivalent to virtualenv and rbenv.</p>
<pre class=&#34;prettyprint&#34;>
$ curl -kL http://install.perlbrew.pl | bash
</pre>
<p>Follow the on screen instructions and install your desired perl version (this doc uses 5.18.1)</p>
<pre class=&#34;prettyprint&#34;>
$ perlbrew install perl-5.18.1
$ perlbrew switch perl-5.18.1
</pre>
<p>Install cpanm</p>
<pre class=&#34;prettyprint&#34;>
$ perlbrew install-cpanm
</pre>
<h2 id=&#34;setup&#34;>Setup</h2>
<h3 id=&#34;checkoutsourcelocallyandonremoteserver&#34;>Checkout source locally and on remote server</h3>
<p>It is best to fork the code into your github account since you&#39;ll be<br />
storing your own posts. This is for demonstration only.</p>
<pre class=&#34;prettyprint&#34;>
$ git clone git://github.com/battlemidget/ztunzeed.git
</pre>
<h3 id=&#34;installdependencieslocallyandonremoteserver&#34;>Install dependencies locally and on remote server</h3>
<p>This is equivalent to python&#39;s pip or ruby&#39;s gem.</p>
<pre class=&#34;prettyprint&#34;>
$ cpanm --installdeps .
</pre>
<h3 id=&#34;setupnginxonremoteserver&#34;>Setup nginx on remote server</h3>
<pre class=&#34;prettyprint&#34;>
$ cp blog.nginx.conf /etc/nginx/sites-enabled/blog.conf
</pre>
<p>Edit the configuration to match your hostname and root directory for this application.</p>
<h3 id=&#34;setupubicontheremoteserverwhereyouhostyourblog&#34;>Setup <a href=&#34;https://metacpan.org/release/Ubic&#34;>Ubic</a> on the remote server where you host your blog</h3>
<p>You can install this right in your home directory to keep your application self-contained.</p>
<pre class=&#34;prettyprint&#34;>
$ ubic-admin setup
</pre>
<p>Place the following in your $HOME/ubic/service/blog</p>
<pre class=&#34;prettyprint&#34;>
use Ubic::Service::Plack;
return Ubic::Service::Plack->new({
   server => &#34;Starman&#34;,
   server_args => {
   env => &#39;production&#39;,
   host => &#39;127.0.0.1&#39;,
   workers => 5,
   port => 9001,
 },
 app => &#39;/home/blagger/blagger&#39;,
 app_name => &#39;blagger&#39;,
});
</pre>
<p>Start the service monitor</p>
<pre class=&#34;prettyprint&#34;>
$ ubic start blog
</pre>
<h2 id=&#34;writeablogpost&#34;>Write a blog post</h2>
<pre class=&#34;prettyprint&#34;>
$ ./blagger blag a-new-blog-post
</pre>
<h2 id=&#34;commitanddeploy&#34;>Commit and deploy</h2>
<pre class=&#34;prettyprint&#34;>
$ git commit -asm &#39;new blog post&#39; &#38;&#38; git push -q
$ rex deploy
</pre>
<p>This will deploy and checkout your source remotely via <a href=&#34;http://rexify.org&#34;>Rex</a> and restart the gaurdian service for the blog.</p>
<p>Once you&#39;ve done the first deployment any future posts only require you to commit to git and deploy.</p>
