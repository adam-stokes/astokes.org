---
layout: post.jade
status: publish
published: true
title: quickly beautify your javascript in emacs
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 83
wordpress_url: http://beta.astokes.org/quickly-beautify-your-javascript-in-emacs/
date: 2013-09-02T21:55Z
categories:
- Emacs
- javascript
tags:
- javascript
- lisp
- emacs
---
<p>This is for the javascript version of js-beautify and could easily apply to their python version as well. You'll need to have node installed with npm and run the following:</p>
<pre><code>$ sudo npm install -g js-beautify
</code></pre>
<p>Next, open up your emacs init file (<strong>~/.emacs.d/init.el</strong>) and add the following lisp code:</p>
<pre><code>(defun jstidy ()
  'Run js-beautify on the current region or buffer.'
  (interactive)
  (save-excursion
    (unless mark-active (mark-defun))
    (shell-command-on-region (point) (mark) 'js-beautify -f -'; nil t)))
(global-set-key "\C-cg" 'jstidy)
</code></pre>
<p>Once you've re-evaluated or restarted emacs the (<strong>CTRL+c then g</strong>) will be bound to the <em>jstidy</em> function.</p>
<p>Finally, load up any javascript file and either mark a region or not and press the key commands to execute jstidy and you should see your code re-formatted nicely.</p>
