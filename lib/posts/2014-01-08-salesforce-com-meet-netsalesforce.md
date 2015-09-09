---
layout: post.jade
status: publish
published: true
title: Salesforce.com meet Net::Salesforce
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 492
wordpress_url: http://astokes.org/?p=492
date: 2014-01-08T12:53Z
categories:
- What's New
- perl
tags:
- salesforce
---
<p>I've got a couple of new perl packages written for interacting with Salesforce.com, it's features include:</p>
<ul>
<li>OAuth 2 authentication with support for scopes including refresh_token and api. Easily add more for what you need in your application.</li>
<li>Client that will query sobjects via JSON api so no more SOAP!</li>
</ul>
<p>Net::Salesforce is in pretty good condition to be used daily and Net::Salesforce::Client is usable but needs more models added to interact with Salesforce API. So far I've got models written for Accounts and Cases with more coming soon.</p>
<p>As always contributions welcomed! You can find the code hosted on github at the following:</p>
<ul>
<li><a href="https://github.com/battlemidget/Net-Salesforce">Net::Salesforce</a></li>
<li><a href="https://github.com/battlemidget/Net-Salesforce-Client">Net::Salesforce::Client</a></li>
</ul>
