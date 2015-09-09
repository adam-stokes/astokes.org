---
layout: post.jade
title: Get up and running with skryf a perl blog engine
date: 2013-06-20T00:42Z
tags:
- cms
- blog
- library
---
<p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>
<pre><code>$ morbo <p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>
which skryf<p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>

</code></pre>
<h2>RUN (Production)</h2>
<p>I use Ubic to manage the process</p>
<pre><code>use Ubic::Service::SimpleDaemon; 
my $service = Ubic::Service::SimpleDaemon-&gt;new( 
          bin =&gt; "hypnotoad -f <p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>
<pre><code>$ morbo <p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>
which skryf<p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>

</code></pre>
<h2>RUN (Production)</h2>
<p>I use Ubic to manage the process</p>
which skryf<p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>
<pre><code>$ morbo <p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>
which skryf<p>Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.</p>
<h2>PREREQS</h2>
<p>I like <a href="http://perlbrew.pl">perlbrew</a>, but, whatever you're comfortable with. I won't judge.</p>
<h2>INSTALLATION (SOURCE)</h2>
<pre><code>$ git clone git://github.com/battlemidget/App-skryf.git
$ cpanm --installdeps . 
</code></pre>
<h2>SETUP</h2>
<p>By default <strong>skryf</strong> will look in <em>dist_dir</em> for templates and media. To override that make sure <strong>~/.skryf.conf</strong> points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.</p>
<pre><code>$ mkdir -p ~/blog/{posts,templates,public}
</code></pre>
<p>Another useful reference would be to check out <a href="https://github.com/battlemidget/stokes-blog">my git repo</a> that hosts this site.</p>
<p>Edit <strong>~/.skryf.conf</strong> to reflect those directories in media_directory, post_directory, and template_directory.</p>
<pre><code>## Available vars: ## %bindir% (path to executable's dir)
## %homedir% (current $HOME) 
post_directory =&gt; '%homedir%/blog/posts', 
template_directory =&gt; '%homedir%/blog/templates',
media_directory =&gt; '%homedir%/blog/public', 
</code></pre>
<p>You'll want to make sure that files exist that reflect the template configuration options.</p>
<pre><code>post_template =&gt; 'post',
index_template =&gt; 'index',
about_template =&gt; 'about',
css_template =&gt; 'style',
</code></pre>
<p>So <strong>~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}</strong> and <strong>~/blog/public/style.css</strong></p>
<h2>DEPLOY</h2>
<pre><code>$ export BLOGUSER=username
$ export BLOGSERVER=example.com 
</code></pre>
<p>If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.</p>
<pre><code>$ rex deploy
</code></pre>
<h2>RUN (Development)</h2>

</code></pre>
<h2>RUN (Production)</h2>
<p>I use Ubic to manage the process</p>
", 
          cwd =&gt; "/home/username", 
          stdout =&gt; "/tmp/blog.log", 
          stderr =&gt; "/tmp/blog.err.log", 
          ubic_log =&gt; "/tmp/blog.ubic.log", 
          user =&gt; "username" );
</code></pre>
