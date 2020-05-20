---
title: On Integration Testing and Microservices
date: "2015-10-18T20:40:00.000Z"
tags:
  - microservices
  - testing
  - soa
---

Some weeks ago I was asked how to properly do integration testing in a
microservices environment. At that time, I was aware that testing basic
behaviour with integration tests was not a smart move. Guaranteeing
compatibility among services' interfaces, however, was something I could
see the value of. The dos and don'ts, in such effort, were not familiar
to me, though. Therefore, I decided to dive in and find some answers.

To begin with, higher level (e.g. end-to-end, integration) testing lacks several
benefits of unit testing, many of which we have come to value as an industry. On
the other hand, not all bugs are apparent at an unit level. They could also
happen on the wiring between components or even in those off-the-shelf solutions
that you employed to speed up your development. Yet you often heard the agile
community endorsing unit tests as the backbone of a solid testing strategy. People
like [@mikewcohn], who established the initial model of the [testing pyramid], were
key in developing the notion that the ratio of a particular kind of test, in your
test suite, should be inversely proportional to the degree of granularity of the
tested scope. Principle that helps a solid test suite to be built in the most
cost-effective way. And beware, since going in the opposite direction may result
in an instance of the [ice cream cone] anti pattern. So, even though you certainly
could find several definitions for the properties of good unit tests out there,
those roughly translate to:

- Fast
- Automated
- Isolated
- Informative
- Idempotent

The first one is easy to explain, as long-running tests are the easiest way to make
programmers develop the bad habit of avoid running tests frequently. And, if that
happens, what is the point anyway? Automated since the intention is to facilitate
adoption, not making people do repetitive work. Isolated because they should not
overlap, otherwise you would have more places to look for when something fails.
Informative, because the context of the failure should be explicit. Yep, you probably
do not want people to analyse your test's source so that they can understand what
went wrong. Finally, idempotency implies that they should behave the same, no matter
which order or how many times they were run. Believe me, tests that randomly fail
are a recipe for madness. They are worse than no tests at all, as they undermine
developers' trust in their test suite.

So, how do those properties apply to higher level (e.g. end-to-end, integration)
testing. First, they are not as fast as unit tests. Especially if you are testing
two [microservices], process that would involve exchanging some packets over the
network (latency sucks :/). They are not idempotent too, as there are many ways
they could go wrong. Units that rely in global state (e.g. singleton pattern)
can also suffer from that unpredictability, but a proper use of dependency
injection can fix the problem. As for lost packets, network partition, good luck
with it. Informative, well, you know something in between a set of components/services
is not working well. Isolated? Nope, even though you can be cautious enough to avoid
chatty components/services, one bug in one of them and you would suddenly find
yourself in a situation in which every code path along the way fail. But hey, they
could be automated.

Did you find my point of view a bit extreme? Then try [@jbrains] amazing talk titled
[Integrated Tests Are a Scam]. Seriously, if you want to laugh a bit with integrated
tests' infamous positive feedback loop of negative emotions, watch it. Additionally,
a written equivalent of it is available on [Integrated Tests are a Scam: Part 1]. In
the aforementioned talk, [@jbrains] shows how the promises of high level testing
lures developers into favouring writing more tests of the same kind that, at the end,
would provide very few coverage. Due to the combinatorial explosion of required tests,
needed for the continuously increasing code paths. Instead, he advocates that we should
spend our time with worthwhile tests. By worthwhile he means tests that help assessing
the quality of our architecture, allowing us to improve its design in the long run.
Position that is understandable, since he is a test-driven development (TDD) practitioner.
After all, TDD is not about testing, it is about design. As for the tests, they are solely
a pleasant by-product.

In [Part 2: Some Hidden Costs of Integration Tests], he also discusses about an important
side-effect of slow tests, they destroy developers' productivity. Waiting for a few seconds
is OK, but it is not rare to find tests suites that take ten minutes or more. Unfortunately,
one cannot simply return to him/her peak performance right after such a long interruption.
In [Part 3: The risks associated with lengthy tests], the focus changes to the insidious
consequences of frequent false alerts, given the lack of isolation when things fail. And
with less trust in the test suite, a fear of change starts to evolve among developers.
Individuals that tend to justify their behaviour by mentioning an old engineering saying
_"If it works, why change it?"_. Rationale that will ultimately lead to an architectural
stagnation and to high interest rates in the form of [technical debt]. Quite the contrary
to what you expected when you got bought into the practice of [self testing code], right?

But do not get him wrong, his disregard for integration testing limits itself to cases
in which they are used for assessing basic correctness. Role that is better suited to
unit tests, in the first place. In [Using integration tests mindfully: a case study], for
instance, he does see a value in employing integration tests for identifying system-level
issues like broken database schema, mistaken cache integration, and more complex problems.
That is, using integration tests to check the presence of a expected feature, is perfectly
fine.

Still, in [Integrated Tests Are a Scam], [@jbrains] proposes an alternative for testing the
interaction between components without resorting to integration testing. He suggests
combining collaboration and contract tests. Collaboration tests are a well known practice,
often named as [test doubles]. More specifically, stubs are the the kind of doubles we
are interested in. Stubs tend to mimic others' interfaces, but instead of doing real work,
they return pre-computed results. Behaviour that is really useful when non-deterministic
or slow operations (e.g. IO) are at stake, as we can employ fast and predictable unit-like
tests to achieve a similar end. As for contract tests, they check the format of an
component/service response, not its data. So, in the case of [microservices], you would
be testing if the outcome of a particular call has the fields you expected and if so,
whether they comply with your use cases. Similarly, [@martinfowler] also see the combination
of stubs and contract tests as a good way to tackle the slowness and unreliability of
integration tests, as stated in [integration contract test].

One challenge though is that testing against a double does not guarantee that the external
component/service is being accurately represented. And even if so, future changes would
require the double to be updated accordingly. One alternative to streamline the updates of
stubs would be what [@martinfowler] calls [self initialising fakes]. Similarly, contract
testing also suffers from the same synchronisation burden, however [self initialising fakes]
cannot help contract tests in the same manner. Additionally, there is also the possibility of
contracts and stubs getting out of sync. Problem that could be mitigated by a shared metadata
file or data structure that specifies available calls and what should be received in response,
so that you do not have to concern yourself with it.

To reduce the odds of getting out of sync, therefore breaking your test cases, or even
worse, being misled by passing tests that should have failed, it is recommended to adopt
a consumer-driven contract approach. In [Consumer-Driven Contracts: A Service Evolution
Pattern], the concept is explained in a relatively implementation agnostic fashion. In a
nutshell, consumer-driven contracts are a means of applying "just enough" validation, as
proposed by [John Postel's Law], which puts the responsibility to specify what the service
provider must comply on the clients. The service provider must then check the union of
its consumers' expectations, in order to verify that there were no regressions. Additionally,
that approach has some notable design advantages. First, it facilitates evolving your
interface, as you wouldn't have to rely on schema extension points for adding new fields
to your messages. Second, since what is consumed is explicitly stated, deprecating a field
that nobody is using is way easier.

Fortunately, the usefulness of mixing stubs and consumer-driven contract tests have led
to the development of frameworks such as [Pact] and [Pacto], both written in Ruby. More
importantly, they facilitate your stubs and contract tests to be in sync. Personally, I
think that frameworks like that are a really promising way for guaranteeing compatibility
among services' interfaces, while maintaining many of the unit testing properties. So, next
time you get yourself considering to test some [microservices] with integration testing,
think twice. If you just want to check compatibility among services' interfaces, invest in
stubs and consumer-driven contract testing instead.

[microservices]: http://martinfowler.com/articles/microservices.html
[@mikewcohn]: https://twitter.com/mikewcohn
[ice cream cone]: http://watirmelon.com/2012/01/31/introducing-the-software-testing-ice-cream-cone/
[testing pyramid]: http://martinfowler.com/bliki/TestPyramid.html
[@jbrains]: https://twitter.com/jbrains
[integrated tests are a scam]: https://vimeo.com/80533536
[test doubles]: http://martinfowler.com/bliki/TestDouble.html
[@martinfowler]: https://twitter.com/martinfowler
[self testing code]: http://martinfowler.com/bliki/SelfTestingCode.html
[technical debt]: http://martinfowler.com/bliki/TechnicalDebt.html
[self initialising fakes]: http://martinfowler.com/bliki/SelfInitializingFake.html
[john postel's law]: https://en.wikipedia.org/wiki/Robustness_principle
[integration contract test]: http://martinfowler.com/bliki/IntegrationContractTest.html
[integrated tests are a scam: part 1]: http://www.jbrains.ca/permalink/integrated-tests-are-a-scam-part-1
[part 2: some hidden costs of integration tests]: http://www.jbrains.ca/permalink/part-2-some-hidden-costs-of-integration-tests
[part 3: the risks associated with lengthy tests]: http://www.jbrains.ca/permalink/part-3-the-risks-associated-with-lengthy-tests
[using integration tests mindfully: a case study]: http://www.jbrains.ca/permalink/using-integration-tests-mindfully-a-case-study
[consumer-driven contracts: a service evolution pattern]: http://martinfowler.com/articles/consumerDrivenContracts.html
[pact]: https://github.com/realestate-com-au/pact
[pacto]: https://thoughtworks.github.io/pacto/
