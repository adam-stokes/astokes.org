#!/usr/bin/zsh

./bin/build-assets.zsh

posts=($HOME/Dropbox/Articles/*.md)
echo "compiling blog"
coffee ./bin/build-posts $posts
coffee ./bin/build-index $posts
