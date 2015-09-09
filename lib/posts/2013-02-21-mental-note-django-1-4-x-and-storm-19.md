---
layout: post.jade
title: 'Mental Note: Django 1.4.x and Storm .19'
author: Adam Stokes
date: 2013-02-21T15:00Z
tags: [ubuntu]
---
<p>Some notes on getting Storm used as a database backend for Django. Props to James Henstridge for doing the heavy lifting.</p>
<h3 id=&#34;setupvirtualenvandinstalldependencies:&#34;>Setup virtualenv and install dependencies:</h3>
<pre class=&#34;prettyprint&#34;>
$ virtualenv --prompt=stormy venv
$ source venv/bin/activate
$ pip install django storm psycopg2 pytz python-dateutil
$ pip freeze > requirements.txt
</pre>
<h3 id=&#34;setupdjangoskeleton&#34;>Setup django skeleton</h3>
<pre class=&#34;prettyprint&#34;>
$ django-admin.py startproject myproject
$ cd myproject
$ python manage.py startapp common
</pre>
<h3 id=&#34;editsettings.pytoincludethepropermiddlewareandstorm_stores&#34;>Edit <strong>settings.py</strong> to include the proper middleware and STORM_STORES</h3>
<pre class=&#34;prettyprint&#34;>
MIDDLEWARE_CLASSES = (
        &#39;django.middleware.common.CommonMiddleware&#39;,
        &#39;django.contrib.sessions.middleware.SessionMiddleware&#39;,
        &#39;django.middleware.csrf.CsrfViewMiddleware&#39;,
        &#39;django.contrib.auth.middleware.AuthenticationMiddleware&#39;,
        &#39;django.contrib.messages.middleware.MessageMiddleware&#39;,
        &#39;storm.django.middleware.ZopeTransactionMiddleware&#39;,       # Added this line
        # Uncomment the next line for simple clickjacking pro
        )

STORM_STORES = { &#39;default&#39; : &#34;postgres://adam@localhost/testdb&#34; }
</pre>
<h3 id=&#34;nextinmyappaddsomemodels&#34;>Next in my app add some models</h3>
<pre class=&#34;prettyprint&#34;>
from django.db import models
from storm.sqlobject import StringCol, UtcDateTimeCol, BoolCol, IntCol
from storm.locals import Int
from storm.expr import SQL
from datetime import datetime
from pytz import UTC
import dateutil.parser

class Bug(models.Model):
      __storm_table__ = &#34;bug&#34;
      id = Int(primary=True,)
      date_created = UtcDateTimeCol(notNull=True,)
      date_last_message = UtcDateTimeCol()
      date_last_updated = UtcDateTimeCol()
      date_made_private = UtcDateTimeCol()
      description = StringCol(notNull=True,)
      duplicate_of = IntCol()
      heat = IntCol()
      gravity = IntCol()
      information_type = StringCol()
      latest_patch_uploaded = UtcDateTimeCol()
      message_count = IntCol(notNull=True,)
      number_of_duplicates = IntCol()
      other_users_affected_count_with_dupes = IntCol()
      owner = IntCol(notNull=True,)
      private = BoolCol(notNull=True, default=False,)
      security_related = BoolCol(notNull=True, default=True,)
      tags = StringCol()
      title = StringCol(notNull=True,)
      users_affected_count = IntCol()
      users_affected_count_with_dupes = IntCol()
      web_link = StringCol()
      who_made_private = IntCol()
</pre>
<h3 id=&#34;pullthedataintotheview&#34;>Pull the data into the view</h3>
<pre class=&#34;prettyprint&#34;>
from django.core.context_processors import csrf
from django.shortcuts import render_to_response, HttpResponseRedirect
from storm.django.stores import *
from myproject.common.models import *

def index(request):
    store = get_store(&#39;default&#39;)
    bug = store.find(Bug)
    return render_to_response(&#34;common/index.html&#34;, { &#39;bug&#39; : bug })
</pre>
<h3 id=&#34;finallyeditthetemplatetodisplaythedata&#34;>Finally, edit the template to display the data</h3>
<pre class=&#34;prettyprint&#34;>
{% raw %}
{% extends &#39;layout.html&#39; %}

{% block page_name %}Home{% endblock %}

{% block content %}
{% for b in bug %}
  {{ b.id }} : {{ b.title }}
{% endfor %}
{% endblock content %}
{% endraw %}
</pre>
<p>Things to do:</p>
<ul>
<li>Have <strong>get_store</strong> persisted when the application starts</li>
<li>Integrate migrations with South</li>
<li>Integrate with something like celery for running some background jobs</li>
</ul>
<p>I haven&#39;t done anything major other than a few queries so time will tell how well this does when this project really gets into making use of Storm.</p>
