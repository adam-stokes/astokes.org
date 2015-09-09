---
layout: post.jade
title: Multiline sql statements in clojure
author: Adam Stokes
date: 2012-12-04T00:00Z
tags: [clojure]
---
<p><strong><em>NB</em></strong> Most of these articles are geared towards those are who not<br />
really familiar with Clojure and are just getting started. (like me)</p>
<p>As I&#39;m continuing to dig through clojure and specifically database<br />
interactions I&#39;ve been writing some simple sql statements with a few<br />
joins. First off we&#39;ll define our namespace:</p>
<pre class=&#34;prettyprint&#34;>
    (ns rosay.models
      (:require [clojure.java.jdbc :as sql]
                [clojure.string :as string]))
</pre>
<p>Next I&#39;ve written a simple helper function that will read in an sql<br />
statement with optional arguments.</p>
<pre class=&#34;prettyprint&#34;>
    (defn db-read
      &#34;processes query returns result&#34;
      [query &#38; args]
      (sql/with-connection
        rosay-db
        (sql/with-query-results res (vec (cons query args)) (doall res))))
</pre>
<p>From here we can do something like:</p>
<pre class=&#34;prettyprint&#34;>
    rosay.server=> (def client-id 1)
    rosay.server=> (db-read &#34;select * from clients where id=?&#34; client-id)
</pre>
<p>This is simple and straightforward approach, but, I&#39;d like to be able<br />
to add more complexity to the sql statement and still keep things<br />
rather readable in emacs.</p>
<p>This helper function basically takes a vector and joins it with a<br />
<em>space</em>. Nothing fancy or even fault tolerant but for this experiment<br />
it works.</p>
<pre class=&#34;prettyprint&#34;>
    (defn- simple-query
      [query]
      &#34;Vector of query data for multiline sql statements&#34;
      (string/join &#34; &#34; query))
</pre>
<p>Now that I have this simple query builder I can expand on the<br />
complexity of my SQL statements but still keep it readable.</p>
<pre class=&#34;prettyprint&#34;>
    (defn get-pages [client-id]
      &#34;return associated client pages&#34;
      (db-read (simple-query [&#34;SELECT p.*, c.username, pt.name as page_type from pages p&#34;
                              &#34;LEFT OUTER JOIN clients as c on p.client_id = c.id&#34;
                              &#34;LEFT OUTER JOIN pages_types as pt on p.pages_type_id = pt.id&#34;
                              &#34;WHERE client_id=?&#34;
                              ]) client-id))
</pre>
<p>From my research there wasn&#39;t really a decent way to do multiline like<br />
above so this was the simplest thing I could come up with.</p>
<p>Finally, to test from the nrepl I can run:</p>
<pre class=&#34;prettyprint&#34;>
    rosay.server=> (use &#39;rosay.models)
    nil
    rosay.server=> (get-pages 19)
    ({:created_on #inst &#34;2012-12-04T19:23:06.614156000-00:00&#34;, :keywords
    &#34;words&#34;, :pages_type_id 11, :name &#34;nameo&#34;, :updated_on nil, :client_id
    19, :username &#34;beef, :page_type &#34;article&#34;, :frontpage true, :id 7,
    :description &#34;description&#34;} {:created_on #inst
    &#34;2012-12-04T19:23:09.109556000-00:00&#34;, :keywords &#34;words&#34;,
    :pages_type_id 11, :name &#34;nameo&#34;, :updated_on nil, :client_id 19,
    :username beef&#34;, :page_type &#34;article&#34;, :frontpage true, :id 8,
    :description &#34;description&#34;})
</pre>
<p>I&#39;ll be improving on these in time but in the distant future this is<br />
suitable for my experiements.</p>
