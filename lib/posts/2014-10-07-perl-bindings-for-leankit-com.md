---
layout: post.jade
title: Perl bindings for LeanKit.com
date: 2014-10-07T07:38Z
featured: leankit.png
tags: [api, json, rest]
---
I recently released a Perl API client for LeanKit which covers the majority of exposed endpoints from the service.

This library can be installed from CPAN and supports Perl versions 5.14+:

```
$ cpanm Net::LeanKit
```

### An example use of the library:

```perl
use strict;
use warnings;
use Net::LeanKit;

my $lk = Net::LeanKit->new(email => 'email@mail.com',
                           password => 'password',
                           account => 'mycompany');

print("Listing known boards\n");
foreach my $board (@{$lk->getBoards}) {
  printf("Board Name: %s has an id of %s\n", $board->{Title}, $board->{Id});
}

my $boardByName = $lk->getBoardByName('Getting Started');
print("Board Lanes\n");
foreach my $lane (@{$boardByName->{Lanes}}) {
  printf("Lane id (%s) with title (%s)\n", $lane->{Id}, $lane->{Title});
}
```

This library is designed to match the same functionality as the <a href="https://github.com/LeanKit/leankit-node-client">official nodejs client</a>.

Documentation on the available api can be found at <a href="https://metacpan.org/pod/Net::LeanKit">the release page</a>. Also feel free to visit the <a href="https://github.com/battlemidget/p5-leankit">github page</a> and to see other available bindings head over to <a href="https://support.leankit.com/entries/28686507-Other-LeanKit-API-Wrappers-and-Examples">LeanKit's API wrappers</a> page.
