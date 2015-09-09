---
layout: post.jade
title: Fedora 8, Thinkpad T61, fingerprint authentication
author: Adam Stokes
date: 2008-02-20T00:59Z
tags: ['whats new']
---
<p>Using a T61 or any IBM laptop that has the fingerprint scanner install the package thinkfinger :</p>
<pre class=&#34;prettyprint&#34;>
# yum install thinkfinger
</pre>
<p>Add your user:</p>
<pre class=&#34;prettyprint&#34;>
# su -
# tf-tool --add-user adam
</pre>
<p>Swipe your finger 3 times.</p>
<p>Alter /etc/pam.d/system-auth to include the think_finger pam module. Mine looks like :</p>
<pre class=&#34;prettyprint&#34;>
#%PAM-1.0# This file is auto-generated.
# User changes will be destroyed the next time authconfig is run.
auth        required      pam_env.so
auth        sufficient    pam_thinkfinger.so
auth        sufficient    pam_unix.so nullok try_first_pass
auth        requisite     pam_succeed_if.so uid >= 500 quiet
auth        required      pam_deny.so
account     required      pam_unix.so
account     sufficient    pam_localuser.so
account     sufficient    pam_succeed_if.so uid 
account     required      pam_permit.so
password    requisite     pam_cracklib.so try_first_pass retry=3
password    sufficient    pam_unix.so md5 shadow nullok try_first_pass use_authtok
password    required      pam_deny.so
session     optional      pam_keyinit.so revoke
session     required      pam_limits.so
session     [success=1 default=ignore] pam_succeed_if.so service in crond quiet use_uid
session     required      pam_unix.so
</pre>
<p>Once complete logout of Gnome, and attempt to login by clicking or typing your associated user name and then swipe your finger :)</p>
