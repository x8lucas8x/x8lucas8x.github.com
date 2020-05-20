---
title: Pythonic interfaces in Go Generators
date: "2015-09-12T19:30:00.000Z"
tags:
  - python
  - golang
---

One of the amazing things about Python is that once you embody the so called Zen
of Python, no matter which language you are using, the philosophy will prevail.
Or, in other words, even if you are learning the Go language, the extent of the
pythonistas' ethos will probably find its way in. So, in order to contextualise
a bit, this post will dwell on the implementation of a lazy list evaluation
mechanism, equivalent to Python's generators, in the Go language.

Among [Python]'s many superpowers, generators is clearly a major one. Brought from
functional languages, like [Haskell], which have demonstrated how better being lazy
is in terms of speed and memory management, especially when collections' size
can grow indefinitely.

In [Python], besides list comprehension, there are also the less known dictionary
and generator comprehensions. Being the later, what we are interested in the scope
of this post. So, considering we want a program that receives an user input and
then print all the multiples of 2 up to a certain limit, unknown a priori. For
such, we could:

```python
from itertools import (count, takewhile)

limit = int(input())
multiples_of_2 = takewhile(lambda x: x <= limit, (x*2 for x in count()))

for x in multiples_of_2:
    print(x)
```

For the sake of simplicity, note that no error checking concerning the user input
was done in the previous example. The same rule will apply for next examples.
Despite that, one could use the yield operator instead of employing generator
comprehension:

```python
from itertools import count

def multiples_of_2(limit):
    for x in (x*2 for x in count()):
        if limit > 25:
            raise StopIteration
        yield x

limit = int(input())

for x in multiples_of_2(limit):
    print(x)
```

For your information, those Python's examples were meant to [Python] 3. As some of
you may know, the input() function, in [Python] 2, also evals the input string,
behaviour that can lead to serious security flaws. Therefore, if you still use
[Python] 2, favour the raw_input() function instead.

Even though we do not have the same constructs in Go, we still can employ [Go]'s
channels to end with a very similar effect. In such effort, two channels could be
used. One for passing the data per se and another to signal that the upper bound
limit was reached, therefore closing the data's channel. That is needed to emulate
the [Python]'s StopIteration exception, which signals that the generator is now
empty. So, without further ado:

```go
package main

import "fmt"

func multiples_of_2(c chan int, quit chan struct{}, limit int) {
	for x := 0; true; x += 2 {
		if x > limit {
			quit <- struct{}{}
			break
		}

		c <- x
	}
}

func main() {
    var limit int
    fmt.Scan(&limit)

	c := make(chan int)
	quit := make(chan struct{})

	defer close(c)
	defer close(quit)

	go multiples_of_2(c, quit, limit)
	for {
		select {
		case x := <-c:
			fmt.Println(x)
		case <-quit:
			return
		}
	}
}
```

Note that the quit channel uses an empty struct. The reason is twofold. First,
empty structs does not occupy memory space, amount that could be substantial at
scale. Second, as the [Zen of Python] states: "explicit is better than implicit".
So, by passing an empty struct we make it clear that the whole point of that
particular channel is for signalling only, therefore avoiding users to wonder if
there is a difference between true and false if, otherwise, we have declared that
channel as a bool channel for instance.

Besides that, the multiples_of_2's interface expose a lot about the business logic
of our custom generator. Besides that, the whole process of initialising/closing a
channel is quite repetitive. And as the [DRY] principle preaches, repetition is the
root of all evil. Not to mention the fact that we could solve this problem with a
single channel, instead of two. But fear not, that required channel can be
encapsulated inside multiples_of_2, leading to an interface that is very similar to
the pythonic one.

```go
package main

import "fmt"

func multiples_of_2(limit int) (chan int) {
    c := make(chan int)

    go func() {
        defer close(c)
        for x := 0 ; true; x+=2 {
	        if x > limit { break }

            c <- x
        }
    }()

    return c
}

func main() {
    var limit int
    fmt.Scan(&limit)

    for x:= range multiples_of_2(limit) {
        fmt.Println(x)
    }
}
```

So, that is all. At the expense of some extra work in our APIs, we can provide
very pythonic interfaces for lazy evaluated lists in [Go]. Now without the need
to worry about channels or concurrency at all. As a matter of fact, synchronous
APIs, like the last example, should be favoured in [Go], given using synchronous
APIs in an asynchronous manner is easy in [Go], while the contrary is not.

[python]: https://www.python.org/
[go]: https://golang.org/
[haskell]: https://www.haskell.org/
[dry]: https://en.wikipedia.org/wiki/Don't_repeat_yourself
[zen of python]: https://www.python.org/dev/peps/pep-0020/
