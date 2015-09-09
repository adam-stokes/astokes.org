---
layout: post.jade
title: Lenovo x230 Tablet tips
author: Adam Stokes
date: 2012-11-01T00:59Z
tags: [x230]
---
<p>Some tips for getting around the lack of tablet functionality with Ubuntu Precise and even Quantal. First is a small shell script for disabling finger touch on the tablet when you want to use the stylus for writing/drawing.</p>
<pre class=&#34;prettyprint&#34;>
    #!/bin/bash
    # This script can be used to toggle enable state of wacom multitouch screen for
    # Thinkpad Tablet Series. You may need to change the name of multitouch device 
    # which can be found by running *xinput list* command

    TOGGLE=$HOME/.multitouch_toggle

    if [ ! -e $TOGGLE ]; then
        touch $TOGGLE
        xinput set-prop &#39;Wacom ISDv4 E6 Finger touch&#39; &#39;Device Enabled&#39; 0
    else
        rm $TOGGLE
        xinput set-prop &#39;Wacom ISDv4 E6 Finger touch&#39; &#39;Device Enabled&#39; 1
    fi
</pre>
<p>This allows you to place your hand comfortably down on the tablet while you hand write notes in applications such as Xournal or drawing in applications such as MyPaint.</p>
<p>Another script for rotating the orientation and making sure the mouse recognizes the new quadrants (rather than up being down, down being up, etc) can be found on github. The url for that project is <a href=&#34;https://github.com/martin-ueding/think-rotate.git&#34;>think-rotate</a>. You can rotate left, right, and back to default. This works in all desktop environments and window managers, however, attempting to navigate smoothly through the UI like you would within a smartphone or android/iphone tablet still needs some more work. As of right now Unity is the same UI no matter the resolution or orientation of the device.</p>
<p>I am going to do some more work and hopefully get some integrated hotkey events into udev so that you may simply swivel the screen into a tablet and the orientation happens automatically.</p>
