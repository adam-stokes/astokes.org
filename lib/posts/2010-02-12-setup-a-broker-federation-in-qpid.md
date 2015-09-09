---
layout: post.jade
title: Setup a broker federation in qpid
date: 2010-02-12T00:59Z
tags: []
---
<p>One of the things with matahari is that we didn&#8217;t want our agents to be tied down to just 1 broker. With qpid we can setup broker federation and squash any of the use case scenarios that may involve differences in location, etc.</p>
<p>To start setup 2-3 brokers, in this writeup there are 2 brokers running on one machine and a 3rd on a second machine.</p>
<p>BrokerA has ip 192.168.1.3 and a port 10001<br />
BrokerB has ip 192.168.1.3 and a port 10002<br />
BrokerC has ip 192.168.1.5 and a port 10001</p>
<p>Startup all three brokers and for the 2 that are on the same machine some options will need to be set</p>
<pre class=&#34;prettyprint&#34;>
# BrokerA
# qpidd -p 10001 --pid-dir /tmp/brokera --data-dir /tmp/brokera --auth no
# BrokerB
# qpidd -p 10002 --pid-dir /tmp/brokerb --data-dir /tmp/brokerb --auth no
# BrokerC
# qpidd -p 10001 --pid-dir /tmp/brokerc --data-dir /tmp/brokerc --auth no
</pre>
<p>Now we need to link all 3 together (federated) into a broker exchange. To do so run the following on any of the machines with brokers to be linked or a machine with no broker at all. The next tools being listed do not require a broker to be running in order to network the brokers together.</p>
<p>qpid-route is the utility being used and for simplicities sake we will be setting up dynamic routes (described in section 1.4.3.2 of the previous link)</p>
<pre class=&#34;prettyprint&#34;>
# qpid-route dynamic add 192.168.1.3:10001 192.168.1.3:10002 amq.direct
# qpid-route dynamic add 192.168.1.3:10002 192.168.1.3:10001 amq.direct
# qpid-route dynamic add 192.168.1.3:10001 192.168.1.5:10001 amq.direct
# qpid-route dynamic add 192.168.1.5:10001 192.168.1.3:10001 amq.direct

# qpid-route dynamic add 192.168.1.3:10001 192.168.1.3:10002 qmf.default.direct
# qpid-route dynamic add 192.168.1.3:10002 192.168.1.3:10001 qmf.default.direct
# qpid-route dynamic add 192.168.1.3:10001 192.168.1.5:10001 qmf.default.direct
# qpid-route dynamic add 192.168.1.5:10001 192.168.1.3:10001 qmf.default.direct

# qpid-route dynamic add 192.168.1.3:10001 192.168.1.3:10002 qmf.default.topic
# qpid-route dynamic add 192.168.1.3:10002 192.168.1.3:10001 qmf.default.topic
# qpid-route dynamic add 192.168.1.3:10001 192.168.1.5:10001 qmf.default.topic
# qpid-route dynamic add 192.168.1.5:10001 192.168.1.3:10001 qmf.default.topic
</pre>
<p>Now I know this looks like a lot of repetition but the above is required since we are creating a bidirectional route. Looking carefully we see that the brokers are being flipped an added to the same exchange.</p>
<p>Speaking of broker exchange you&#8217;ll notice amq.direct, qmf.default.direct, qmf.default.topic. These exchanges are the default exchanges that need to be supported in any AMQP broker. To get a better idea of these routing algorithms there is a blogpost that covers it pretty clearly.</p>
<p>Moving on we need to do a quick check on the topology which can be accomplished with the following</p>
<pre class=&#34;prettyprint&#34;>
# qpid-route route map 192.168.13:10001

Finding Linked Brokers:
192.168.1.3:10001... Ok
192.168.1.5:10001... Ok
192.168.1.3:10002... Ok

Dynamic Routes:

Exchange qmf.default.topic:
192.168.1.5:10001 <=> 192.168.1.3:10001
192.168.1.3:10002 <=> 192.168.1.3:10001

Exchange qmf.default.direct:
192.168.1.5:10001 <=> 192.168.1.3:10001
192.168.1.3:10002 <=> 192.168.1.3:10001

Exchange amq.direct:
192.168.1.5:10001 <=> 192.168.1.3:10001
192.168.1.3:10002 <=> 192.168.1.3:10001

Static Routes:
none found
</pre>
<p>The brokers are now federated (networked together) so lets do something useful. We will connect one of matahari&#8217;s core agent to any of the brokers on both machines.</p>
<pre class=&#34;prettyprint&#34;>
# matahari-hostd --port 10001 --broker 192.168.1.5

# matahari-hostd --port 10001 --broker 192.168.1.3
</pre>
<p>Above we&#8217;ve just connected the agent on one machine to the broker on the other and vice versa. So now if we bring up qpid-tool on BrokerB we should see that 2 agents are connected within this broker network and we will be able to interact with those agents no matter where we are.</p>
<pre class=&#34;prettyprint&#34;>
# qpid-tool 192.168.1.3:10002

qpid: agents
Agent Name                                                 Label QMF version
1.0 BrokerAgent                                            QMFv2
1.redhat.com:matahari:4d3d4442-562a-4514-a639-b366ef17e306 QMFv2 Agent 2
1.redhat.com:matahari:fb7584d4-8d10-4cea-ab30-ae4afaea1060 QMFv2 Agent 2
</pre>
<p>With both agents connected we can access their methods and pull some data from it.</p>
<pre class=&#34;prettyprint&#34;>
    qpid: list host
    Object Summary:
       ID   Created   Destroyed  Index
       =====================================================
       161  22:03:47  -          com.redhat.matahari:host:
       101  21:05:51  -          com.redhat.matahari:host:

    qpid: show 161
    Object of type: com.redhat.matahari:host:_data(7297d90c-5e2a-557c-7b58-90cdd4d916f2)
       Attribute         161
       ===================================================================
       uuid              ec742c182da05427605f96b300000014
       hostname          im.gangstar.com
       is_virtual        False
       operating_system  Linux (2.6.34.7-61.fc13.i686)
       memory            3057352
       swap              2047996
       arch              i686
       hypervisor       
       platform          32
       processors        2
       cores             4
       model             Intel(R) Core(TM)2 Duo CPU     T9600  @ 2.80GHz
       last_updated_seq  83
       last_updated      Fri Nov 12 22:10:37 2010
       load_average_1    0.000000
       load_average_5    0.020000
       load_average_15   0.000000
       memFree           186788
       swapFree          1987552
       procTotal         394
       procRunning       1

    qpid: show 101
    Object of type: com.redhat.matahari:host:_data(7297d90c-5e2a-557c-7b58-90cdd4d916f2)
       Attribute         101
       ===================================================================
       uuid              3d4c71ac60c0b113d8ce73b700000016
       hostname         im.gangster-twice.com
       is_virtual        False
       operating_system  Linux (2.6.34.7-61.fc13.i686)
       memory            2036688
       swap              4095996
       arch              i686
       hypervisor       
       platform          32
       processors        2
       cores             4
       model             Intel(R) Core(TM)2 Duo CPU     T7500  @ 2.20GHz
       last_updated_seq  795
       last_updated      Fri Nov 12 22:12:03 2010
       load_average_1    0.120000
       load_average_5    0.120000
       load_average_15   0.110000
       memFree           168912
       swapFree          4091164
       procTotal         384
       procRunning       4
</pre>
<p>Pretty simple and really cool :D</p>
