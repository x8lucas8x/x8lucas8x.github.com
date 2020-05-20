---
title: "What to put on the Redux state"
date: "2020-05-20T21:00:00.000Z"
tags:
  - redux
  - frontend
---

Following up the [react]/[redux] community these past years, I've seen many inquiring
whether [redux], or any equivalent state management solution, was even needed for
achieving X or Z in a SPA. Alternatives such as using the [context API], as a
simpler [redux] clone, or even ignoring it altogether and going for [component state]
were also common place.

Being not one to favour dichotomies, I won't try to convince you that [redux] is the
way to go, given I myself had repented over using [redux] for some use cases.
In hindsight one of those bad decisions involved adopting [redux form] for handling form
state. If you asked me, a couple years ago, had you any need to have form data
in [redux] specifically? I certainly couldn't raise one valid point for that. Of course
[redux form] API was nice and facilitated form handling, but it also created its
own share of problems.

Unfortunately [react final form], [formik] and others weren't available at the time.
So [redux form] just seemed right. That said I've had my own share of issues,
especially when dealing with big forms. More specifically it dispatches a [redux] action
per field registration, during initial render, which made forms with many fields
feel sluggish. Still an issue present on it, which libraries relying on [component state]
such as [react final form] and [formik] don't have. In fact even [redux form]'s
creator recommends the use of [react final form] nowadays, if you have no need to
have form data in [redux]. It's worth mentioning that both were created by the same
person.

With that I intend to exemplify that being adamant about a technical or methodological
choice might cause you trouble anyway. Oh, I won't have such problems because I
opted on using the [context API] instead of [redux], you might say. But
relying on the [context API] has its drawbacks. Most noticeably the fact
that any change on the value of a given context provider will trigger a re-render
of its underlying component tree, even if it changes something that your
component isn't even using. Of course you can have your [React.memo],
[PureComponent] or [shouldComponentUpdate] life-cycle method in place, but that
wouldn't be an issue with [react redux]. On [react redux], assuming default behaviour,
a re-render will only happen when the [shallow comparison of the returned object's
fields of the mapStateToProps is true][connectrenderrule] or when the
[strict equality of the returned value of the useSelector hook is true][useselectorrenderrule].
So as you see [redux] is better optimized when it comes to avoiding re-renders,
which is paramount when you are connecting components at many levels
of the component tree, as you should.

For those reasons, I'd recommend the following:

- Use [redux] for interactions with the backend, which are tied to pages, not
  shareable components. Most GETs, PUTs, PATCHes and DELETEs should apply.
- Use the [context API] for global level configuration, such as styles,
  internationalization, authentication info, user preferences and what not.
- Use the [component state] for the kind of components that are shared across
  distinct pages (e.g. form handling, dialogs), even when those require
  backend interactions (e.g. autocomplete selects). Usually if you can't
  justify why you need [redux], that's what you need.

What's your take on it? Do you agree? Do you have your own set of guidelines?
Please follow up on the comments below.

[react]: https://reactjs.org/
[redux]: https://redux.js.org/
[react redux]: https://react-redux.js.org/
[context api]: https://reactjs.org/docs/context.html
[component state]: https://reactjs.org/docs/state-and-lifecycle.html
[connectrenderrule]: https://react-redux.js.org/using-react-redux/connect-mapstate#return-values-determine-if-your-component-re-renders
[useselectorrenderrule]: https://react-redux.js.org/7.1/api/hooks#equality-comparisons-and-updates
[react.memo]: https://reactjs.org/docs/react-api.html#reactmemo
[purecomponent]: https://reactjs.org/docs/react-api.html#reactpurecomponent
[shouldcomponentupdate]: https://reactjs.org/docs/react-component.html#shouldcomponentupdate
[redux form]: https://github.com/redux-form/redux-form
[react final form]: https://github.com/final-form/react-final-form
[formik]: https://jaredpalmer.com/formik/
