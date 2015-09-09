---
layout: post.jade
title: Perl bindings for Juju
date: 2014-02-16T23:55Z
featured: juju.svg
tags: perl, juju, ubuntu
---
In an attempt to better learn the Juju internals I started working on
some Perl bindings and as a result a lot of time spent in the Go
codebase. The library utilizes an event-based approach making use of
technologies such as [AnyEvent](https://metacpan.org/pod/AnyEvent) and
[AnyEvent::WebSocket::Client](https://metacpan.org/pod/AnyEvent::WebSocket::Client). I
am still going through the golang code to make the library api
complete and the code is considered alpha quality so not recommended
in production by any means. The library is located on
[GitHub](https://github.com/battlemidget/perl-juju), as always
contributions welcomed. :P

## A quick walkthrough

Installing is easy with `cpanm`, simply point the client at the github
repo and the dependencies will be handled for you:

### Installing

`$ cpanm git@github.com:battlemidget/perl-juju.git`

### Example

This code snippet shows you how to pull the juju environment data

```perl
#!/usr/bin/env perl

use strict;
use warnings;
use v5.18.0;
use Juju::Environment;
use Mojo::JSON qw(j);
use Data::Dumper;

$Data::Dumper::Indent = 1;

my $client = Juju::Environment->new(
    endpoint => 'wss://10.0.3.1:17070/',
    password => '211fdd69b8942c10cef6cfb8a4748fa4'
);
$client->login;
my $_info = $client->info;
print Dumper($_info);

$client->close;

__END__

Output of code:

$VAR1 = {
  'Name' => 'local',
  'DefaultSeries' => 'precise',
  'UUID' => '23929e29-5b3d-42d7-8984-5e18319aeacb',
  'ProviderType' => 'local'
};
```

I should probably put a disclaimer that this isn't endorsed by
Canonical and please dont report any issues with this library to the
Juju team. For now this is nothing more than a hobby project and maybe
a helpful starting point for others to write bindings in their
preferred language.
