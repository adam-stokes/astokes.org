---
template: single.hbs
title: Run MAAS in Vagrant
date: 2013-10-02T13:29Z
featured: maas.png
tags:
- python
- juju
- maas
- vagrant
- metal-as-a-service
- precise
- '12.04'
- cloud-in-a-box
---
<p>This article covers the steps I took to run a <a href="http://maas.ubuntu.com">MAAS</a> instance within <a href="http://vagrantup.com">vagrant</a>.</p>
<p>I think of this more like the most direct and reproducable approach I could think of. You could build off of this and automate a lot of the installation tasks with a vagrant provisioner like puppet, chef, saltstack, or ansible. In my case I like to use <a href="http://www.ansibleworks.com/">Ansible</a> which is written by Michael DeHaan who wrote <a href="https://fedorahosted.org/func/">func</a> back in the day. I loved func and ansible feels more at home to me.</p>
<h1>Installing and configuring MAAS</h1>
<h2>Software used</h2>
<ul>
<li>Ubuntu Precise 12.04 (latest updates)</li>
<li>vagrant 1.3.x</li>
<li><a href="https://github.com/fgrehm/vagrant-lxc">vagrant lxc</a></li>
<li>maas</li>
<li>lxc</li>
</ul>
<h2>Install lxc</h2>
<pre><code>% sudo apt-get install lxc
</code></pre>
<h2>Install Vagrant</h2>
<p>Download and install vagrant via <a href="http://downloads.vagrantup.com/tags/v1.3.3">vagrant install link</a></p>
<pre><code>% wget http://files.vagrantup.com/packages/0ac2a87388419b989c3c0d0318cc97df3b0ed27d/vagrant_1.3.4_x86_64.deb
% sudo dpkg -i vagrant_1.3.4_x86_64.deb
</code></pre>
<h2>Install vagrant-lxc</h2>
<pre><code>% vagrant plugin install vagrant-lxc
</code></pre>
<h2>Install a lxc supported vagrant box</h2>
<pre><code>% vagrant box add precise64 http://bit.ly/vagrant-lxc-precise64-2013-09-28
</code></pre>
<h2>Create a Vagrantfile</h2>
<p>Add the following into your <strong>Vagrantfile</strong></p>
<pre><code>Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.provider :lxc do |lxc|
    lxc.customize 'cgroup.memory.limit_in_bytes', '1024M'
    lxc.customize 'cgroup.devices.allow', 'b 7:* rwm'
    lxc.customize 'cgroup.devices.allow', 'c 10:237 rwm'
  end
end
</code></pre>
<h2>Cache sudo password</h2>
<p>There is a <a href="http://www.sudo.ws/repos/sudo/file/c158df7cd9d2/NEWS#l523">bug</a> that prevents sudo password from being cached on sudo &lt; 1.8.4. To get around this the vagrant-lxc <a href="https://github.com/fgrehm/vagrant-lxc/wiki/Avoiding-%27sudo%27-passwords">wiki page</a> suggests the following:</p>
<pre><code># Load up visudo and append the following
% sudo visudo
Defaults !tty_tickets
</code></pre>
<h2>Run the vagrant box</h2>
<pre><code>% vagrant up --provider=lxc
</code></pre>
<h2>SSH into the vagrant box</h2>
<pre><code>% vagrant ssh
</code></pre>
<h2>Add additional repository</h2>
<p>A <strong>ubuntu-cloud</strong> archive exists for providing the latest juju, maas, etc bits on precise. Enable this to get the latest MAAS versions.</p>
<pre><code>vagrant@precise-base:~$ sudo apt-get install -qy ubuntu-cloud-keyring &lt;/dev/null
vagrant@precise-base:~$ sudo tee /etc/apt/sources.list.d/cloud-tools-precise.list &lt;&lt;EOF
deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
deb-src http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
EOF
</code></pre>
<h2>Update the repository and install MAAS</h2>
<pre><code>vagrant@precise-base:~$ sudo apt-get update 
vagrant@precise-base:~$ sudo apt-get install maas maas-dhcp maas-dns
</code></pre>
<h2>Create your MAAS superuser</h2>
<pre><code>vagrant@precise-base:~$ sudo maas createsuperuser
</code></pre>
<p>It's a pain doing this many times over, pulled this tip from <a href="http://source.mihelac.org/2009/10/23/django-avoiding-typing-password-for-superuser/">Bojan Mihelac</a></p>
<pre><code>echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | sudo maas shell
</code></pre>
<h2>Login to your MAAS UI</h2>
<p>In your web browser visit the IP (something like http://10.0.3.32/MAAS) of the vagrant box to log into your MAAS instance.</p>
<h2>Import your boot images</h2>
<p>Once logged in click on the <strong>cog</strong> icon in the top right hand corner.</p>
<p><a href="http://astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS.png"><img src="http://astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS.png" alt="maas settings" width="189" height="159" class="alignnone size-full wp-image-286" /></a></p>
<p>On the settings page just under <strong>Cluster controllers</strong> click the <strong>import boot images</strong> button.</p>
<p><a href="http://astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS-1.png"><img src="http://astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS-1.png" alt="maas import boot images" width="670" height="114" class="alignnone size-full wp-image-287" /></a></p>
<p>This will take awhile to run so maybe go get some coffee.</p>
<p>If you want to speed things up a bit edit <code>/etc/maas/import_pxe_files</code> with the following</p>
<pre><code>vagrant@precise-base:~$ cat /etc/maas/import_pxe_files 
# This file replaces an older one called import_isos.  Include that here for
# compatibility.
if [ -f /etc/maas/import_isos ]
then
    cat &gt;&amp;2 &lt;&lt;EOF

Including obsolete /etc/maas/import_isos in configuration.  This file has been
superseded by import_pxe_files.  Please see if it can be removed.

EOF
    . /etc/maas/import_isos
fi


RELEASES="precise"
ARCHES="amd64/generic"
LOCALE="en_US"
#IMPORT_EPHEMERALS=1
</code></pre>
<h2>Cluster interface configuration</h2>
<p>Once the boot images are done you are ready to configure one of the network interfaces to be managed by MAAS. Click on the edit icon under <strong>Cluster controllers</strong>. In the <strong>Edit Cluster Controller</strong> page click on the edit icon next to the interface you'd like to configure. In this case I am using <strong>eth0</strong>. <a href="http://astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Controller-precise-base-MAAS.png"><img src="http://astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Controller-precise-base-MAAS.png" alt="Edit cluster interface" width="594" height="192" class="alignnone size-full wp-image-290" /></a></p>
<p>On the next page titled <strong>Edit Cluster Interface</strong> we are going to set <strong>eth0</strong> to manage <strong>dhcp</strong> and <strong>dns</strong> along with entering the ip information for our network. Since vagrant is using 10.0.3.32 as its IP we'll set the rest according to that. <a href="http://astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Interface-precise-base-MAAS-1.png"><img src="http://astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Interface-precise-base-MAAS-1.png" alt="Edit Cluster Interface   precise-base MAAS (1)" width="605" height="704" class="alignnone size-full wp-image-336" /></a></p>
<h2>Troubleshooting</h2>
<h3>DBusException error with avahi</h3>
<pre><code>DBusException: org.freedesktop.DBus.Error.NameHasNoOwner: Could not get owner of name 'org.freedesktop.Avahi': no such name
</code></pre>
<h3>Solution</h3>
<p>Comment out <strong>rlimit-nproc</strong> in <code>/etc/avahi/avahi-daemon.conf</code>, then start the service. <a href="http://sourceforge.net/mailarchive/message.php?msg_id=29200350">See here</a> for more information on this issue and user namespaces in lxc.</p>
<pre><code>vagrant@precise-base:~$ sudo service avahi-daemon restart
</code></pre>
<h3>Failing to mount ephemeral image</h3>
<pre><code>precise-ephemeral-maas-amd64.img
mount: Could not find any loop device. Maybe this kernel does not know
       about the loop device? (If so, recompile or `modprobe loop'.)
Tue, 01 Oct 2013 19:33:58 +0000: failed to mount /tmp/uec2roottar.MmKLTg/precise-ephemeral-maas-amd64.img
failed to create root image
failed to prepare image for precise/amd64
</code></pre>
<h3>Solution</h3>
<p>Per <a href="http://www.mail-archive.com/lxc-users@lists.sourceforge.net/msg03673.html">this post</a></p>
<ol>
<li>Copy <code>/etc/apparmor.d/lxc/lxc-default</code> to <code>/etc/apparmor.d/lxc/lxc-default-with-loops</code></li>
<li>Edit <code>/etc/apparmor.d/lxc/lxc-default-with-loops</code>
<ul>
<li>Rename lxc-container-default to lxc-container-default-with-loops</li>
<li>Add an entry: <code>"mount -&gt; /tmp/*/*,"</code> or matching the source node, fstype,</li>
</ul>
</li>
<li><code>% sudo /etc/init.d/apparmor reload</code></li>
<li>Edit your container's configuration and set lxc.aa_profile to lxc-container-default-with-loops
<ul>
<li><strong>Note</strong>: this would be <code>lxc.customize "aa_profile", "lxc-container-default-with-loops"</code> in your <strong>Vagrantfile</strong></li>
</ul>
</li>
<li>Restart your container</li>
</ol>
<h1>Conclusion</h1>
<p>That's pretty much it! Whether this is actually useful remains to be seen. Nevertheless, this was a good learning experience for me. :) Oh and if you read this far down I did automate most of this which you can find over at my <a href="https://github.com/battlemidget/vagrant-maas">github vagrant-maas repo</a>.</p>
<pre><code>% git clone git://github.com:battlemidget/vagrant-maas.git
% cd vagrant-maas
% vagrant plugin install vagrant-lxc
% vagrant box add precise64 http://bit.ly/vagrant-lxc-precise64-2013-09-28
% vagrant up --provider=lxc --provision-with ansible
% vagrant provision
</code></pre>
