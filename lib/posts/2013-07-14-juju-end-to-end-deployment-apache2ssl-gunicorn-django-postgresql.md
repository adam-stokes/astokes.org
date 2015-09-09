---
layout: post.jade
title: 'Juju deploy Apache2+SSL, Gunicorn, Django, Postgresql'
date: 2013-07-14T22:02Z
featured: juju.svg
tags:
- ubuntu
- linux
- python
- juju
- shellscript
- django
---
<p>Goal of this document is to explain how <a href="https://wiki.ubuntu.com/christopherarges">Chris Arges</a> and I managed to get Apache w/SSL proxy to gunicorn which is serving up a django application with postgresql as the database and everything be deployable through Juju.</p>
<p>As an added bonus I'll also show you how to utilize Launchpad.net's SSO to enable authentication to your web application.</p>
<p>I will also break this document up into 2 parts with the first part concentrating on configuring your django application for deployment and the other doing the actual bootstrapping and deployment. Make sure you read the document in its entirety since they rely on each other to properly work.</p>
<h1>Pre-requisites</h1>
<ul>
<li>Ubuntu 12.04</li>
<li>Juju 0.7</li>
<li>You'll want to have an existing django project created which uses postgresql as the database backend. I won't go into details on setting that up since this focuses purely on deploying with Juju, but, <a href="https://docs.djangoproject.com/en/1.4/intro/install/">Django</a> documentation is excellent in getting up and running.</li>
</ul>
<p>The rest of the necessary bits are handled by Juju.</p>
<h1>The environment</h1>
<p>In this document I use LXC as the containers for juju deployment. You could easily use AWS or any other supported cloud technologies. The directory layout for this tutorial looks like this:</p>
<pre><code>  - /home/adam/deployer
    - djangoapp/
      - settings.py
      - manage.py
      - urls.py
      - mydjangoapp/
        - models.py
        - views.py
        - urls.py
    - charms/precise/django-deploy-charm
      - hooks/
      - files/
      - templates/
      - config.yaml
      - metadata.yaml
      - README
      - revision
</code></pre>
<p>The <strong>djangoapp</strong> directory houses my django application and <strong>charms/precise/django-deploy-charm</strong> is my local charm that handles all of the Juju hooks necessary to get my environment up.</p>
<h1>PART UNO: Configuring your Django application</h1>
<h2>Enable importing of database overrides from Juju</h2>
<p>Edit <strong>settings.py</strong> and append the following:</p>
<pre><code>  # Import juju_settings.py for DB overrides in juju environments
  try:
      from djangoapp.juju_settings import *
  except ImportError:
      pass
</code></pre>
<p>This will override the default database so you can choose to ignore the current databases stanza in the <strong>settings.py</strong> file.</p>
<h2>Enable Django to properly prefix URLS if coming from an SSL Referer</h2>
<p>This is the first part of telling Django to expect requests from the Apache reverse proxy over HTTPS.</p>
<p>Edit <strong>settings.py</strong> and add the following somewhere after the python import statements. (location of this is probably optional, but, im cautious so we add it at the beginning)</p>
<pre><code>  # Make sure that if we have an SSL referer in the headers that DJANGO
  # prefixes all urls with HTTPS

  SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
</code></pre>
<p>Remember that added bonus? Go ahead and define the necessary Launchpad.net bits</p>
<p>For Django to work with Launchpad's SSO service you'll want to make sure that <strong>django-openid-auth</strong> is installed. This will be handled by Juju and I'll show you that in <strong>PART DOS</strong>.</p>
<p>Again edit <strong>settings.py</strong> to include the following OpenID configuration items.</p>
<pre><code>  ALLOWED_EXTERNAL_OPENID_REDIRECT_DOMAINS = [&amp;#39;lvh.me&amp;#39;, &amp;#39;localhost&amp;#39;, &amp;#39;yourfqdn.com&amp;#39;]
</code></pre>
<p>For development purposes I usually use lvh.me to associate a fqdn with my loopback.</p>
<p>Add the authorization backend to the <strong>AUTHENTICATION_BACKENDS</strong> tuple:</p>
<pre><code>  # Add support for django-openid-auth
  AUTHENTICATION_BACKENDS = (
      &amp;#39;django_openid_auth.auth.OpenIDBackend&amp;#39;,
      &amp;#39;django.contrib.auth.backends.ModelBackend&amp;#39;,
  )
</code></pre>
<p>Add some helpful options to associating Launchpad accounts with user accounts in your django app.</p>
<pre><code>  OPENID_CREATE_USERS = True
  OPENID_UPDATE_DETAILS_FROM_SREG = True
  OPENID_SSO_SERVER_URL = &amp;#39;https://login.launchpad.net/&amp;#39;
  OPENID_USE_AS_ADMIN_LOGIN = True

  # The launchpad teams and staff_teams  were manually created at launchpad.net
  OPENID_LAUNCHPAD_TEAMS_REQUIRED = [
      &amp;#39;debugmonkeys&amp;#39;,
      &amp;#39;canonical&amp;#39;,
  ]
  OPENID_LAUNCHPAD_STAFF_TEAMS = (
      &amp;#39;debugmonkeys&amp;#39;,
  )
  OPENID_STRICT_USERNAMES = True
  OPENID_USE_EMAIL_FOR_USERNAME = True
</code></pre>
<p>Set the <strong>LOGIN_URL</strong> path to where redirected users will go to login.</p>
<pre><code>  LOGIN_URL = &amp;#39;/openid/login/&amp;#39;
  LOGIN_REDIRECT_URL = &amp;#39;/&amp;#39;
&lt;h2 id="summaryofpartuno"&gt;Summary of Part UNO&lt;/h2&gt; 
</code></pre>
<p>This configuration will have your django application prepped for juju deployment with the ability to authenticate against launchpad.net and automatically associate the postgres database settings.</p>
<h1>PART DOS: Configure and deploy your juju charm</h1>
<h2>Defining your config and metadata options</h2>
<p>In <strong>config.yaml</strong> youll want to make sure the following options are defined and set:</p>
<pre><code>  options:
    requirements:
      type: string
      default: &amp;#34;requirements.txt&amp;#34;
      description: |
        The relative path to the requirement file. Note that the charm
        won&amp;#39;t manually upgrade packages defined in this file.
    instance_type:
      default: &amp;#34;staging&amp;#34;
      type: string
      description: |
        Selects if we&amp;#39;re deploying to production or development.
        production == deploying to prodstack
        staging == local development (lxc/private cloud)
    user_code_runner:
        default: &amp;#34;webguy&amp;#34;
        type: string
        description: The user that runs the code
    group_code_runner:
        default: &amp;#34;webguy&amp;#34;
        type: string
        description: The group that runs the code
    user_code_owner:
        default: &amp;#34;webops_deploy&amp;#34;
        type: string
        description: The user that owns the code
    group_code_owner:
        default: &amp;#34;webops_deploy&amp;#34;
        type: string
        description: The group that owns the code
    app_payload:
      type: string
      description: |
        Filename to use to extract the actual django application.
        This file must be in the files/ directory.
      default: &amp;#34;djangoapp.tar.bz2&amp;#34;
    web_app_admin:
      type: string
      description: Web application admin email
      default: &amp;#34;webguy@example.com&amp;#34;
    wsgi_wsgi_file:
      type: string
      description: &amp;#34;The name of the WSGI application.&amp;#34;
      default: &amp;#34;wsgi&amp;#34;
    wsgi_worker_class:
      type: string
      default: &amp;#34;gevent&amp;#34;
      description: &amp;#34;Gunicorn workers type. (eventlet|gevent|tornado)&amp;#34;
</code></pre>
<p>In the <strong>metadata.yaml</strong> file we need to define the relation information, create that file with the following:</p>
<pre><code>  name: django-deploy-charm
  maintainer: [Adam Stokes &amp;#38;lt;adam.stokes@ubuntu.com&amp;#38;gt;]
  summary: My Django project
  description: |
    Django website for My Django App
  provides:
    website:
      interface: http
    wsgi:
      interface: wsgi
      scope: container
  requires:
    db:
      interface: pgsql
</code></pre>
<p>The <strong>revision</strong> file keeps a positive integer to let Juju know that a new revision with changes are available. It is also recommended to add a <strong>README</strong> laying out the juju deploy steps for getting your charm up and running.</p>
<h2>Write your charm hooks</h2>
<p>This is where the magic happens, all charm hooks will reside in the <strong>hooks</strong> directory and should be executable.</p>
<h2>A common include file</h2>
<p>Rather than repeating the defining of variables over and over we'll just source it from a common include file. Create a file called <strong>common.sh</strong> and add the following:</p>
<pre><code>  #!/bin/bash

  UNIT_NAME=$(echo $JUJU_UNIT_NAME | cut -d/ -f1)
  UNIT_DIR=/srv/${UNIT_NAME}

  DJANGO_APP_PAYLOAD=$(config-get app_payload)
  INSTANCE_TYPE=$(config-get instance_type)

  USER_CODE_RUNNER=$(config-get user_code_runner)
  GROUP_CODE_RUNNER=$(config-get group_code_runner)
  USER_CODE_OWNER=$(config-get user_code_owner)
  GROUP_CODE_OWNER=$(config-get group_code_owner)

  function ctrl_service {
      # Check if there is an upstart or sysvinit service defined and issue the
      # requested command if there is. This is used to control services in a
      # friendly way when errexit is on.
      service_name=$1
      service_cmd=$2
      ( service --status-all 2&amp;#38;gt;1 | grep -w $service_name ) &amp;#38;amp;&amp;#38;amp; service $service_name $service_cmd
      ( initctl list 2&amp;#38;gt;1 | grep -w $service_name ) &amp;#38;amp;&amp;#38;amp; service $service_name $service_cmd
      return 0
  }
</code></pre>
<h3>The <strong>install</strong> hook This hook handles the extracting, package installation, and permission settings.</h3>
<pre><code>  #!/bin/bash

  source ${CHARM_DIR}/hooks/common.sh

  juju-log &amp;#34;Jujuing ${UNIT_NAME}&amp;#34;

  ###############################################################################
  # Directory Structure
  ###############################################################################
  function inflate {
      juju-log &amp;#34;Creating directory structure&amp;#34;
      mkdir -p ${UNIT_DIR}
  }

  ###############################################################################
  #  User / Group permissions
  ###############################################################################
  function set_perms {
      juju-log &amp;#34;Setting permissions&amp;#34;

      getent group ${GROUP_CODE_RUNNER} ${GROUP_CODE_OWNER} &amp;#38;gt;&amp;#38;gt; /dev/null
      if [[ $? -eq 2 ]]; then
          addgroup --quiet $GROUP_CODE_OWNER
          addgroup --quiet $GROUP_CODE_RUNNER
      fi

      # Check if the users already exists and create a new user if it doesn&amp;#39;t
      if [[ ! `users` =~ ${USER_CODE_OWNER} ]]; then
    adduser --quiet --system --disabled-password --ingroup \
              ${GROUP_CODE_OWNER} ${USER_CODE_OWNER}
      fi
      if [[ ! `users` =~ ${USER_CODE_RUNNER} ]]; then
    adduser --quiet --system --disabled-password --ingroup \
              ${GROUP_CODE_RUNNER} ${USER_CODE_RUNNER}
      fi

      chown -R $USER_CODE_OWNER:$GROUP_CODE_OWNER ${UNIT_DIR}

      usermod -G www-data ${GROUP_CODE_RUNNER}

  }

  ###############################################################################
  # Project Install
  ###############################################################################
  function app_install {
      tar -xf ${CHARM_DIR}/files/${DJANGO_APP_PAYLOAD} -C ${UNIT_DIR}

      juju-log &amp;#34;Installing required packages.&amp;#34;
      # Additional supporting packages
      /usr/bin/apt-add-repository -y ppa:gunicorn/ppa

      # Common packages between instances
      common_pkgs=&amp;#34;python-pip python-dev build-essential libpq-dev python-django python-dateutil python-psycopg2 python-jinja2 pwgen ssl-cert gunicorn&amp;#34;
      # Silence apt-get
      export DEBIAN_FRONTEND=noninteractive
      REQUIREMENTS=$(config-get requirements)
      if [[ ${INSTANCE_TYPE} == &amp;#39;production&amp;#39; ]]; then
    apt-get -qq update

    # Install required packages
    apt-get -qq install -y python-amqplib python-anyjson \
        python-bzrlib python-celery python-cherrypy \
        python-django-celery python-django-openid-auth \
        python-django-south python-launchpadlib python-oauth python-openid \
        python-psycopg2 python-requests-oauthlib python-urllib3 python-salesforce \
        python-cheetah ${common_pkgs}
      else
    apt-get -qq update
    apt-get -qq install -y ${common_pkgs}
    pip install -q -r ${UNIT_DIR}/${REQUIREMENTS} || true
      fi
  }

  ###############################################################################
  # MAIN
  # Steps
  # -----
  # 1) inflate - build directory stucture
  # 2) app_install - install bits
  # 3) set_perms - finalizes permission settings
  ###############################################################################
  inflate
  app_install
  set_perms
</code></pre>
<p>One thing to notice in the <strong>app_install</strong> function is that we are extracting our django application from within the <strong>files/</strong> directory. In order to make this work you'll want to manually tar up your django application and place it into that <strong>files</strong> directory.</p>
<pre><code>  # Make sure we are a level above the djangoapp directory
  $ cd /home/adam/deployer
  $ tar cjf charms/precise/seg-dashboard/files/djangoapp.tar.bz2 -C djangoapp .
&lt;h2 id="the\_\_config-changed\_\_hook"&gt;The 
</code></pre>
<p><strong>config-changed</strong> hook</h2>
<p> This handles the configuring and populating of the django application. Here we are just concerned with symlinking the static assets from the django application.</p>
<pre><code>  ###############################################################################
  # WEB Application Config
  # 1) Setup django application specific directory
  # 2) Symlinks admin media directory
  ###############################################################################
  # 1)
  SETTINGS_PY=&amp;#34;${UNIT_DIR}/settings.py&amp;#34;

  # 2)
  PYTHON_DJANGO_LIB=`python -c &amp;#34;import django; print(django.__path__[0])&amp;#34;`
  mkdir -p /var/www/static
  if [ ! -L /var/www/static/admin ]; then
      ln -s ${PYTHON_DJANGO_LIB}/contrib/admin/static/admin /var/www/static/admin
  fi
&lt;h2 id="the\_\_db-relation-changed\_\_hook"&gt;The 
</code></pre>
<p><strong>db-relation-changed</strong> hook</h2>
<p> This hook is where we define our Postgresql database settings to be included by the django application.</p>
<pre><code>  #!/bin/bash

  # Update the juju_settings.py with the new database credentials
  source ${CHARM_DIR}/hooks/common.sh

  ###############################################################################
  # Export Database settings
  ###############################################################################
  export DBHOST=`relation-get host`
  export DBNAME=`relation-get database`
  export DBUSER=`relation-get user`
  export DBPASSWD=`relation-get password`

  # All values are set together, so checking on a single value is enough
  # If $db_user is not set, DB is still setting itself up, we exit awaiting 
  # next run.
  [ -z &amp;#34;$DBUSER&amp;#34; ] &amp;#38;amp;&amp;#38;amp; exit 0

  cheetah fill --env -p templates/juju_settings.tmpl \
      &amp;#38;gt; ${UNIT_DIR}/juju_settings.py

  # Setup database
  python ${UNIT_DIR}/manage.py syncdb --noinput

  # Create admin fixture
  cheetah compile --env -p templates/juju_fixtures.tmpl \
      &amp;#38;gt; templates/juju_fixtures.py
  python templates/juju_fixtures.py \
      &amp;#38;gt; ${UNIT_DIR}/juju_fixtures.json

  python ${UNIT_DIR}/manage.py loaddata ./juju_fixtures.json

  juju-log &amp;#34;Updating database(${DBNAME}) credentials and importing fixtures&amp;#34;

  ctrl_service gunicorn restart
</code></pre>
<p>As you can see we are processing a few templates to import into the django settings and load an admin fixture into the database.</p>
<h3>The &#42;&#42;juju_settings&#42;&#42; file {#the&#95;&#95;juju_settings&#95;&#95;file}</h3>
<p>This is the database configuration and should reside in the <strong>templates</strong> directory. Edit <strong>juju_settings.tmpl</strong> and populate with the following:</p>
<pre><code>  # Generated by db-relation-changed hook

  # Pull in the project&amp;#39;s default settings
  from djangoapp.settings import *

  # Overrite the database settings
  DATABASES[&amp;#39;default&amp;#39;][&amp;#39;ENGINE&amp;#39;] = &amp;#39;django.db.backends.postgresql_psycopg2&amp;#39;
  DATABASES[&amp;#39;default&amp;#39;][&amp;#39;HOST&amp;#39;] = &amp;#39;${DBHOST}&amp;#39;
  DATABASES[&amp;#39;default&amp;#39;][&amp;#39;NAME&amp;#39;] = &amp;#39;${DBNAME}&amp;#39;
  DATABASES[&amp;#39;default&amp;#39;][&amp;#39;USER&amp;#39;] = &amp;#39;${DBUSER}&amp;#39;
  DATABASES[&amp;#39;default&amp;#39;][&amp;#39;PASSWORD&amp;#39;] = &amp;#39;${DBPASSWD}&amp;#39;
&lt;h3 id="the\_\_juju_fixtures\_\_file"&gt;The 
</code></pre>
<p><strong>juju_fixtures</strong> file</h3>
<p> Edit <strong>juju_fixtures.tmpl</strong> and add the following:</p>
<pre><code>  &amp;#38;lt;%
  import json
  from subprocess import Popen, PIPE

  def quickrun(cmd):
      temp = Popen(cmd, stdout=PIPE).communicate()[0]
      return temp.rstrip()

  adminpasswd = quickrun([&amp;#39;pwgen&amp;#39;, &amp;#39;-s&amp;#39;, &amp;#39;64&amp;#39;, &amp;#39;1&amp;#39;])
  timestamp = quickrun([&amp;#39;date&amp;#39;, &amp;#39;+%F %R&amp;#39;])

  fixture = { &amp;#34;pk&amp;#34; : 1,
              &amp;#34;model&amp;#34; : &amp;#34;auth.user&amp;#34;,
              &amp;#34;fields&amp;#34; : { &amp;#34;username&amp;#34; : &amp;#34;admin&amp;#34;,
                           &amp;#34;password&amp;#34; : adminpasswd,
                           &amp;#34;email&amp;#34; : &amp;#34;&amp;#34;,
                           &amp;#34;first_name&amp;#34; : &amp;#34;&amp;#34;,
                           &amp;#34;last_name&amp;#34; : &amp;#34;&amp;#34;,
                           &amp;#34;is_active&amp;#34; : True,
                           &amp;#34;is_superuser&amp;#34; : True,
                           &amp;#34;is_staff&amp;#34; : True,
                           &amp;#34;last_login&amp;#34; : &amp;#34;now&amp;#34;,
                           &amp;#34;groups&amp;#34; : [],
                           &amp;#34;user_permissions&amp;#34; : [],
                           &amp;#34;date_joined&amp;#34; : timestamp
                           }
              }

  print json.dumps(fixture)
  %&amp;#38;gt;
&lt;h2 id="the\_\_website-relation-joined\_\_and\_\_website-relation-changed\_\_"&gt;The 
</code></pre>
<p><strong>website-relation-joined</strong> and <strong>website-relation-changed</strong></h2>
<p> The changed hook is just a symlink to <strong>website-relation-joined</strong> in this case. Edit your <strong>website-relation-joined</strong> file and add the following:</p>
<pre><code>  #!/bin/bash

  unit_name=${JUJU_UNIT_NAME//\//-}

  relation-set port=8080 hostname=`unit-get private-address`
  relation-set all_services=&amp;#34;
    - {service_name: gunicorn, service_port: 8080}
  &amp;#34;
</code></pre>
<p>We are making sure that apache will have access to the private IP and PORT of the gunicorn application server.</p>
<h2>The &#42;&#42;wsgi-relation-changed&#42;&#42; and &#42;&#42;wsgi-relation-joined&#42;&#42; {#the&#95;&#95;wsgi-relation-changed&#95;&#95;and&#95;&#95;wsgi-relation-joined&#95;&#95;}</h2>
<p>Again the changed hook is symlinked to the joined hook. Edit <strong>wsgi-relation-joined</strong> and add the following:</p>
<pre><code>  #!/bin/bash

  UNIT_NAME=`echo $JUJU_UNIT_NAME | cut -d/ -f1`

  relation-set working_dir=&amp;#34;/srv/${UNIT_NAME}/&amp;#34;
  relation-set django_settings=&amp;#34;${UNIT_DIR}/settings.py&amp;#34;
  relation-set python_path=`python -c &amp;#34;import django; print(django.__path__[0])&amp;#34;`

  variables=&amp;#34;wsgi_wsgi_file wsgi_workers wsgi_worker_class wsgi_worker_connections wsgi_max_requests wsgi_timeout wsgi_backlog wsgi_keep_alive wsgi_extra wsgi_user wsgi_group wsgi_umask wsgi_log_file wsgi_log_level wsgi_access_logfile wsgi_access_logformat port&amp;#34;

  declare -A VAR
  for v in $variables;do
    VAR[$v]=$(config-get $v)
    if [ ! -z &amp;#34;${VAR[$v]}&amp;#34; ] ; then
      relation-set &amp;#34;$v=${VAR[$v]}&amp;#34;
    fi
  done

  juju-log &amp;#34;Set relation variables: ${VAR[@]}&amp;#34;

  service gunicorn restart
</code></pre>
<p>Here the <strong>gunicorn</strong> charm expects a <strong>working_dir</strong> and a <strong>wsgi</strong> interface. These are set with the above relations and also a loop is provided if any other gunicorn options were to be overriden from the defaults provided in that charm.</p>
<h2>The &#42;&#42;apache_vhost&#42;&#42; template {#the&#95;&#95;apache_vhost&#95;&#95;template}</h2>
<p>The apache2 virtualhost stanza that will ultimately provide the outside world access to your django application. Edit <strong>apache_vhost.tmpl</strong> and add the following:</p>
<pre><code>  # Managed by juju
    &amp;#38;lt; VirtualHost *:80 &amp;#38;gt;
      ServerName      {{ servername }}
      Redirect permanent / https://{{ servername }}/
    &amp;#38;lt; /VirtualHost &amp;#38;gt;

    &amp;#38;lt; VirtualHost {{ servername }}:443 &amp;#38;gt;
      ServerName      {{ servername }}
      ServerAdmin     admin@example.com

      CustomLog       /var/log/djangoapp-custom.log combined
      ErrorLog        /var/log/djangoapp-error.log


      SSLEngine on
      SSLCertificateFile /etc/ssl/certs/ssl-cert-cts.pem
      SSLCertificateKeyFile /etc/ssl/private/ssl-cert-cts.key

      RequestHeader set X-FORWARDED-SSL &amp;#34;on&amp;#34;

      # This ensures django is seeing the https protocol
      # and prefixing all URLS with https

      RequestHeader set X-FORWARDED_PROTO &amp;#34;https&amp;#34;

      ProxyRequests off
      ProxyPreserveHost on
      &amp;#38;lt;Proxy *&amp;#38;gt;
          Order Allow,Deny
          Allow from All
      &amp;#38;lt;/Proxy&amp;#38;gt;

      ProxyPass / http://{{ djangoapp_gunicorn }}/
      ProxyPassReverse / http://{{ djangoapp_gunicorn }}/
    &amp;#38;lt; /VirtualHost &amp;#38;gt;
</code></pre>
<p>The items such as SSL, Header modification, and Proxy support are loaded through the apache configuration charm which is discussed below.</p>
<h2 id="summaryofthehooks">Summary of the hooks</h2>
<p>These hooks provide the groundwork for making the rest of the deployment possible. I realize some of the templates aren't making sense at the moment but read further to link the missing pieces.</p>
<h2 id="thejujuenvironmentsetup">The Juju environment setup</h2>
<p>Once the hooks are done and youve compressed a tarball of your django application and have it sitting in your <strong>files/</strong> directory it is time to bootstrap juju and get on our way to deploying. I am assuming no pre-existing juju setup exists. In the case that you have Juju defined for other things then skip the bootstrap.</p>
<h2 id="bootstrapyourjujuenvironment">Bootstrap your Juju environment</h2>
<pre><code>  $ juju bootstrap
</code></pre>
<p>This will create a sample <strong>~/.juju/environments.yaml</strong> file that you can alter. Mine looks like the following for an LXC setup.</p>
<pre><code>  environments:
    sample:
      type: local
      control-bucket: juju-364887954bed48b590b9b6bd112a842a
      admin-secret: fa8d276204ab4be4b3666cc5afe3bd21
      default-series: precise
      ssl-hostname-verification: true
      data-dir: /home/adam/jujuimgs
&lt;h2 id="deploytheapplicationcharm"&gt;Deploy the application charm&lt;/h2&gt; 
</code></pre>
<p>From your toplevel directory, in my case <strong>/home/adam/deployer</strong> execute the following to get the django application deployed.</p>
<pre><code>  $ juju deploy --repository ./charms local:django-deploy-charm
&lt;h2 id="deploytheapplicationservergunicornandsetuptherelationbetweentheapplicationandapplicationserver"&gt;Deploy the application server (gunicorn) and setup the relation between the application and application server&lt;/h2&gt; 

  $ juju deploy gunicorn
  $ juju add-relation gunicorn django-deploy-charm
&lt;h2 id="deployapache2andaddtherelationtotheapplicationforreverseproxyingtowork"&gt;Deploy apache2 and add the relation to the application for reverse proxying to work&lt;/h2&gt; 

  $ juju deploy apache2
  $ juju add-relation apache2:reverseproxy django-deploy-charm
&lt;h3 id="configuretheapache2charmtoloadourvirtualhostandautogeneratethenecessarycertificatesforsslsupport"&gt;Configure the Apache2 charm to load our Virtual Host and auto generate the necessary certificates for SSL support&lt;/h3&gt; 

  $ juju set apache2 &amp;#34;vhost_https_template=$(base64 &amp;#38;lt; templates/apache_vhost.tmpl)&amp;#34;
  $ juju set apache2 &amp;#34;enable_modules=ssl proxy proxy_http proxy_connect rewrite headers&amp;#34;
  $ juju set apache2 &amp;#34;ssl_keylocation=ssl-cert-cts.key&amp;#34;
  $ juju set apache2 &amp;#34;ssl_certlocation=ssl-cert-cts.pem&amp;#34;
  $ juju set apache2 &amp;#34;ssl_cert=SELFSIGNED&amp;#34;
</code></pre>
<p>All of these options are explained in the README of the <strong>apache2</strong> charm. But what this does is basically load a jinja2 supported template, enables the necessary modules in apache for proxy, ssl, and header modification support. Since we are doing a <strong>SELFSIGNED</strong> certificate for development and testing we set the filenames of the certificate and have the <strong>apache2</strong> charm generate the certificates automatically.</p>
<h2 id="deploypostgresqlandsetupthedatabaserelationtoourapplication">Deploy postgresql and set up the database relation to our application</h2>
<pre><code>  $ juju deploy postgresql
  $ juju add-relation django-deploy-charm:db postgresql:db
&lt;h2 id="exposeourapache2servicetotheworld"&gt;Expose our Apache2 service to the world&lt;/h2&gt; 

  $ juju expose apache2
&lt;h1 id="tada"&gt;Tada&lt;/h1&gt; 
</code></pre>
<p>After about 5 or 10 minutes all the services should be deployed and you can get the public facing IP of the apache server by the following:</p>
<pre><code>  $ juju status apache2
</code></pre>
<p>For completeness this is what a fully deployed juju stack should look like:</p>
<pre><code>  machines:
    0:
      agent-state: running
      dns-name: localhost
      instance-id: local
      instance-state: running
  services:
    apache2:
      charm: cs:precise/apache2-11
      exposed: true
      relations:
        reverseproxy:
        - django-deploy-charm
      units:
        apache2/0:
          agent-state: started
          machine: 0
          open-ports:
          - 80/tcp
          - 443/tcp
          public-address: 10.0.3.218
    gunicorn:
      charm: cs:precise/gunicorn-7
      relations:
        wsgi-file:
        - django-deploy-charm
      subordinate: true
      subordinate-to:
      - django-deploy-charm
    postgresql:
      charm: cs:precise/postgresql-30
      exposed: false
      relations:
        replication:
        - postgresql
      units:
        postgresql/0:
          agent-state: started
          machine: 0
          public-address: 10.0.3.119
    django-deploy-charm:
      charm: local:precise/django-deploy-charm-8
      relations:
        website:
        - apache2
        wsgi:
        - gunicorn
      units:
        django-deploy-charm/2:
          agent-state: started
          machine: 0
          public-address: 10.0.3.208
          relations:
            wsgi:
            - gunicorn
          subordinates:
            gunicorn/2:
              agent-state: started
</code></pre>
<p>In this case if I go to <strong>https://10.0.3.218</strong> it should bring up your custom django application. If youve setup authentication with Launchpad.net like in the above example visiting <strong>https://10.0.3.218/openid/login</strong> should redirect your to Launchpad's SSO service and allow you authenticate and redirect back to your django application.</p>
<h2>Contributors welcomed!</h2>
<p>If you would like to checkout the source for the charm itself you can see it on <a href="https://github.com/battlemidget/juju-apache-gunicorn-django.git">Github</a>. Would love to make this charm general enough to give people a great starting point for setting up their environments. If modifications to the document are needed please post in the comments section and Ill get those implemented.</p>
<h2>Things not done</h2>
<ul>
<li>This tutorial doesn't cover how to setup static files as the static files live on the application server and not the apache server itself.</li>
<li>I am aware there is a <strong>django</strong> charm that could easily be used in place of taring up your django application, it would be worth looking into that charm to further your deployment options.</li>
<li>Not tested with Golang version of Juju since LXC support is not available <strong>yet</strong></li>
</ul>
