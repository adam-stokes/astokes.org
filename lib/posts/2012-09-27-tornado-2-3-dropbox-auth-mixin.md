---
layout: post.jade
title: Tornado 2.3+ dropbox auth mixin
author: Adam Stokes
date: 2012-09-27T00:59Z
tags: [dropbox]
---
<p>Working on <a href=&#34;http://tornadoweb.org&#34;>Tornado</a> web application server has been a great<br />
experience. I&#39;ve written a few simple OAuth mixin&#39;s and this<br />
one is for dropbox. It&#39;s been tested and works, however, I am<br />
probably including way to many method overrides. If anyone<br />
would like to update the gist please feel free and I&#39;ll make<br />
sure to link it in this post.</p>
<pre class=&#34;prettyprint&#34;>
class DropboxMixin(tornado.auth.OAuthMixin):
    &#34;&#34;&#34; Dropbox  OAuth authentication.
    &#34;&#34;&#34;
    _OAUTH_REQUEST_TOKEN_URL = &#34;https://api.dropbox.com/1/oauth/request_token&#34;
    _OAUTH_ACCESS_TOKEN_URL = &#34;https://api.dropbox.com/1/oauth/access_token&#34;
    _OAUTH_AUTHORIZE_URL = &#34;https://www.dropbox.com/1/oauth/authorize&#34;
    _OAUTH_VERSION = &#34;1.0&#34;
    _OAUTH_NO_CALLBACKS = False

    def authorize_redirect(self, callback_uri=None, extra_params=None,
                           http_client=None):
        &#34;&#34;&#34;Redirects the user to obtain OAuth authorization for this service.

        Twitter and FriendFeed both require that you register a Callback
        URL with your application. You should call this method to log the
        user in, and then call get_authenticated_user() in the handler
        you registered as your Callback URL to complete the authorization
        process.

        This method sets a cookie called _oauth_request_token which is
        subsequently used (and cleared) in get_authenticated_user for
        security purposes.
        &#34;&#34;&#34;
        http_client = httpclient.AsyncHTTPClient()
        http_client.fetch(
            self._oauth_request_token_url(), self.async_callback(
            self._on_request_token, self._OAUTH_AUTHORIZE_URL, callback_uri))

    def get_authenticated_user(self, callback, http_client=None):
        &#34;&#34;&#34;Gets the OAuth authorized user and access token on callback.

        This method should be called from the handler for your registered
        OAuth Callback URL to complete the registration process. We call
        callback with the authenticated user, which in addition to standard
        attributes like &#39;name&#39; includes the &#39;access_key&#39; attribute, which
        contains the OAuth access you can use to make authorized requests
        to this service on behalf of the user.

        &#34;&#34;&#34;
        request_key = escape.utf8(self.get_argument(&#34;oauth_token&#34;))
        oauth_verifier = self.get_argument(&#34;oauth_verifier&#34;, None)
        request_cookie = self.get_cookie(&#34;_oauth_request_token&#34;)
        if not request_cookie:
            logging.warning(&#34;Missing OAuth request token cookie&#34;)
            callback(None)
            return
        self.clear_cookie(&#34;_oauth_request_token&#34;)
        cookie_key, cookie_secret = [base64.b64decode(escape.utf8(i)) for i in request_cookie.split(&#34;|&#34;)]
        if cookie_key != request_key:
            logging.info((cookie_key, request_key, request_cookie))
            logging.warning(&#34;Request token does not match cookie&#34;)
            callback(None)
            return
        token = dict(key=cookie_key, secret=cookie_secret)
        if oauth_verifier:
            token[&#34;verifier&#34;] = oauth_verifier
        if http_client is None:
            http_client = httpclient.AsyncHTTPClient()
        http_client.fetch(self._oauth_access_token_url(token),
                          self.async_callback(self._on_access_token, callback))

    def _on_access_token(self, callback, response):
        if response.error:
            logging.warning(&#34;Could not fetch access token&#34;)
            callback(None)
            return

        access_token = _oauth_parse_response(response.body)
        self._oauth_get_user(access_token, self.async_callback(
             self._on_oauth_get_user, access_token, callback))

    def _on_oauth_get_user(self, access_token, callback, user):
        if not user:
            callback(None)
            return
        user[&#34;access_token&#34;] = access_token
        callback(user)

    def dropbox_request(self, path, callback, access_token=None,
                        post_args=None, **args):
        # Add the OAuth resource request signature if we have credentials
        url = &#34;https://api.dropbox.com/1&#34; + path
        if access_token:
            all_args = {}
            all_args.update(args)
            all_args.update(post_args or {})
            method = &#34;POST&#34; if post_args is not None else &#34;GET&#34;
            oauth = self._oauth_request_parameters(
                url, access_token, all_args, method=method)
            args.update(oauth)
        if args: url += &#34;?&#34; + urllib.urlencode(args)
        callback = self.async_callback(self._on_dropbox_request, callback)
        http = httpclient.AsyncHTTPClient()
        if post_args is not None:
            http.fetch(url, method=&#34;POST&#34;, body=urllib.urlencode(post_args),
                       callback=callback)
        else:
            http.fetch(url, callback=callback)

    def _on_dropbox_request(self, callback, response):
        if response.error:
            print(&#34;Error response %s fetching %s&#34;, response.error,
                            response.request.url)
            callback(None)
            return
        callback(escape.json_decode(response.body))

    def _oauth_consumer_token(self):
        self.require_setting(&#34;dropbox_consumer_key&#34;, &#34;Dropbox OAuth&#34;)
        self.require_setting(&#34;dropbox_consumer_secret&#34;, &#34;Dropbox OAuth&#34;)
        return dict(
            key=self.settings[&#34;dropbox_consumer_key&#34;],
            secret=self.settings[&#34;dropbox_consumer_secret&#34;])

    def _oauth_get_user(self, access_token, callback):
        callback = self.async_callback(self._parse_user_response, callback)
        self.dropbox_request(
            &#34;/account/info&#34;,
            access_token=access_token,
            callback=callback)

    def _parse_user_response(self, callback, user):
        if user:
            user[&#34;username&#34;] = user[&#34;display_name&#34;]
        callback(user)
</pre>
