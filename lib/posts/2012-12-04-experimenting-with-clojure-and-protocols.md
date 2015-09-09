---
layout: post.jade
title: Experimenting with clojure and protocols
author: Adam Stokes
date: 2012-12-04T00:00Z
tags: [clojure]
---
<p>I started messing around with some clojure code recently to see what I<br />
could come up with in a short period of time. My main goal was to<br />
provide some sort of overlay to adding a specific dispatch to handle<br />
different datatypes when inserting into a database. So for my<br />
experiment I decided to use the jdbc interface within Clojure and some<br />
built-in function/macros to try and make light of my idea.</p>
<p>First I created my namespace to keep everything organized.</p>
<pre class=&#34;prettyprint&#34;>
    (ns rosay.models
      (:require [clojure.java.jdbc :as sql]))
</pre>
<p>Next I defined a postgres database to use and already had some tables<br />
created with a few simple constraints. I won&#39;t go into those details<br />
but I&#39;ll show you what the connection looks like.</p>
<pre class=&#34;prettyprint&#34;>
    (def rosay-db
      {:subprotocol &#34;postgresql&#34;
       :subname &#34;//localhost/rosaydb&#34;
       :user &#34;adbuser&#34;
       :password &#34;dbpass&#34;})
</pre>
<p>From there I defined a helper function to deal with inserting the<br />
record into the database.</p>
<pre class=&#34;prettyprint&#34;>
    (defn- db-insert
      [table record]
      &#34;Inserts record based on table/record map&#34;
      (sql/with-connection
        rosay-db
        (sql/transaction
         (sql/insert-record table record))))
</pre>
<p>All this was outlined in the relevant api documentation. From this<br />
point I setup a protocol to hopefully help me abstract out what to do<br />
for different datatypes I wish to store.</p>
<pre class=&#34;prettyprint&#34;>
    ;; public interface
    (defprotocol DBFactory
      (add-item [_] &#34;Adds item to db&#34;))
</pre>
<p>I&#39;ve defined <strong>add-item</strong> in order to facilitate what it is I wish to<br />
do to each record. The records I am current concentrating on are<br />
these:</p>
<pre class=&#34;prettyprint&#34;>
    (defrecord Page [name description keywords frontpage client_id pages_type_id]
      DBFactory
      (add-item [_]
        (db-insert :pages {:name name
                                      :description description
                                      :keywords keywords
                                      :frontpage frontpage
                                      :client_id client_id
                                      :pages_type_id pages_type_id})))

    (defrecord Client [username password email domain]
      DBFactory
      (add-item [_]
        (db-insert :clients {:username username
                             :password password
                             :email email
                             :domain domain})))
</pre>
<p>With this code in place I load up my REPL and attempt to add a Client<br />
and a Page to my database.</p>
<pre class=&#34;prettyprint&#34;>
    rosay.server=> (use &#39;rosay.models)
     nil
     rosay.server=> (add-item (->Client &#34;booyaka&#34; &#34;fark&#34; &#34;mailzer&#34; &#34;domain.com&#34;))
     {:updated_on nil, :created_on #inst
     &#34;2012-12-04T04:25:22.672462000-00:00&#34;, :email &#34;mailzer&#34;,
     :domain &#34;domain.com&#34;, :password &#34;fark&#34;, :username &#34;booyaka&#34;, :id 10}

     rosay.server=> (add-item (->Page &#34;im a new page&#34; &#34;description of new page&#34; &#34;somekeywords,keywords true 10 1))
    {:updated_on nil, :created_on #inst &#34;2012-12-04T04:41:41.716319000-00:00&#34;, :pages_type_id 1, :client_id 10, :frontpage true, :keywords &#34;somekeywords,keywords&#34;, :description &#34;description of new page&#34;, :name &#34;im a new page&#34;, :id 4}
</pre>
<p>So it looked like it added my records based on the type to the correct<br />
tables.</p>
<p>In summary, it was pretty easy to setup and the approach seems<br />
straight forward to me. Although, I&#39;ve created a SO post to get input<br />
from the more experienced clojure developers on whether or not this<br />
even makes sense. Hopefully, I&#39;m not to far off base with attempting<br />
to abstract out the low-level database interactions when wanting to<br />
add some sort of dispatch-like system when adding records to a<br />
database.</p>
<p><strong><em>NB</em></strong> This entire post could be completely off as I am in no-way a<br />
seasoned clojure/lisp programmer. Recommendations/changes are always welcomed!</p>
