---
layout: post
date: 2016-10-03
title: Update on Esopo
--- 
Last Wednesday, I had the opportunity to drop in on John Cayley's digital
language arts workshop at Brown University for a wonderful discussion on
language, translatability, and the promise/perils of natural language
processing. I won't try to summarise everything that was discussed here, but it
is always interesting to hear (particularly digital) writers bring up their
obsessions and anxieties around the nature of language itself.

Part of our discussion focused on a subject near and dear to my heart: to what
extent programming languages can or should be considered "language" in the same
sense as "natural language." The students in the workshop raised a number of
issues relevant to that question including:

1. The possibility of perfect translatability (e.g. through reduction to [lambda
   calculus](https://en.wikipedia.org/wiki/Lambda_calculus)) of programming
   languages vs. the inherent (and ethically-charged) problems of natural
   language translation
2. The possible non-equivalency of available expression in natural languages
   vs. the [provable
   equivalency](https://en.wikipedia.org/wiki/Turing_completeness) of Turing
   complete programming languages [^1]
3. Issues of culture surrounding programming and natural languages

I'll save a complete rundown of my own opinions on these issues for longer
treatment, but this discussion did prompt me to share my work on the [Esopo
project](/esopo) with the group. And that in turn, prompted me to get off my
butt and finish up one of the Javascript interpreters I've long promised for
that project.

The interpreter ([available here](/ashpaper)) is for AshPaper, one of my
earliest (though not necessarily one of my favorite) Esopo languages. If you
check out the link, you'll be able to play around with AshPaper a little bit
and try creating (and executing) your own AshPaper poems/programs. The
interpreter is not *quite* complete (it does not yet handle end-rhyme at all,
and it has trouble with trickier syllable counts), but there's definitely
enough there to have fun with. Have a poke at it, and [let me know what you
think (Twitter link)](http://twitter.com/home?status=@whimsicalilk)! If you
want detailed information on how to write in AshPaper, check out the [details
of the language here](
https://github.com/wphicks/Esopo/blob/master/AshPaper/informal_specs.txt), but
I'd also be curious to hear what people figure out with it just by playing with
the interpreter.


### Footnotes
[^1]: Discussion here flirted around the edges of the [Sapir-Whorf
    hypothesis](https://en.wikipedia.org/wiki/Linguistic_relativity), but the
    students generally had a slightly more nuanced take.
