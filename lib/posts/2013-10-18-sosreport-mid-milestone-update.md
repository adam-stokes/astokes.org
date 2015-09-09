---
layout: post.jade
title: 'sosreport: mid-milestone update'
date: 2013-10-18T21:00Z
tags:
- ubuntu
- python
- sosreport
---
<p>A small review of what's happening as we enter into our 3rd month of development for the next major release of sosreport 3.1 (<em>approximate due date of February 2014</em>).</p>
<p><strong>Here is a rundown of what we need help on:</strong></p>
<ul>
<li>Documentation</li>
<li>Openstack guru's to review our existing plugins and provide feedback and/or code submissions.
<ul>
<li>Our priority is to make sure we are capturing everything needed to successfully troubleshoot issues occurring within all of openstack's moving parts.</li>
<li>Validating all captured configs to make sure we've scrubbed out any secrets/credentials.</li>
<li>Any new additions since Havana.</li>
</ul>
</li>
<li>MAAS/Juju guru's to review existing plugins and provide feedback and/or code.</li>
<li>Security auditing
<ul>
<li>Mainly need extra set of eyes to make sure none of the plugins capture secret/confidential information along with scrubbing out those bits if unavoidable.</li>
</ul>
</li>
</ul>
<p>We also have a <a href="https://github.com/sosreport/sosreport/issues?milestone=2&amp;state=open">list of bugs needing attention/resolution</a> that would also benefit from community contributions.</p>
<p>Also be aware that <strong><em>support for Python 2.6 will be dropped</em></strong> in the next release as well.</p>
