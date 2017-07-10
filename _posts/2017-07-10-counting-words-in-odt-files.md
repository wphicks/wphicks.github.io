---
layout: post
title: Counting Words in .odt files
date: 2017-07-10
tag:
- programming
- python
---

Rather frequently, I find myself wishing that there were an easy way to count
the number of words in a .odt or .fodt file from command line. Most solutions
I've come across make use of the (very handy)
[odt2txt](https://linux.die.net/man/1/odt2txt) tool, but this doesn't play nice
with .fodt files (at least with the version available in the Ubuntu 16.04
repos). So, I came up with a simple Python script that is a "good enough"
solution for my use cases (though it may not be entirely robust). It's
[available
here](https://gist.github.com/wphicks/991a085174b45720a4255987c290546d) in case
it's of use to anyone else. Working through it gave me a bit better
understanding/appreciation of the .odt format and how it works. Tweaks welcome!


