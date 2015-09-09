---
layout: post.jade
title: Exporting variables for Eshell
author: Adam Stokes
date: 2012-10-18T00:59Z
tags: [emacs]
---
<p>Usually when I&#39;m working in Emacs it is running as a daemon. A lot of<br />
times when I&#39;m doing patch work and commits it&#39;ll want to dump me into<br />
an editor set by my shell settings. More times than not this is<br />
problematic because my editor may be set to nano or vim and rendering<br />
in the eshell is ugly. So far all emacs/eshell sessions I wanted to<br />
make sure my EDITOR/VISUAL environment variables were defined with<br />
&#39;emacsclient -n&#39; in order to push all commit changes into a new buffer<br />
window to be edited.</p>
<p>To remedy this I use a eshell hook to automatically set my environment<br />
variables while in the shell without messing with anything I may have<br />
set outside of emacs.</p>
<pre class=&#34;prettyprint&#34;>
    (add-hook &#39;eshell-mode-hook
              &#39;(lambda nil
                 (eshell/export &#34;EDITOR=emacsclient -n&#34;)
                 (eshell/export &#34;VISUAL=emacsclient -n&#34;)))
</pre>
<p>Pretty straight forward and keeps my eshell editing happy.</p>
