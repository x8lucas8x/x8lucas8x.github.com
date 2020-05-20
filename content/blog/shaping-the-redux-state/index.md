---
title: "Shaping the Redux state"
date: "2020-04-04T10:30:00.000Z"
tags:
  - redux
  - frontend
---

I've being using [redux] since early 2016 and no doubt I learned a lot through
the process. Transitioning from [thunk] to [redux saga] for easier testing and
greater flexibility, adopting [reselect] to prevent costly re-renders, using
[immer] to tame our reducers when plain destructuring and [ramda] revealed their
shortcomings, including [normalizr] to facilitate data normalization across
reducers sharing action types, and even materialising past learnings through
my own [redux] abstraction layer (aka [redux data models]). More on
[redux data models] on another post.

One thing though required a particularly iterative process. That was how our team
have being shaping reducers' state. As you might know there is no convention for
that. So one day you might find yourself with a requirement for an user list page.
After creating an endpoint for retrieving the _list_ data, you might think
you could simply represent all that with the following reducer state:

```json
{
  list: [
    {...},
    ...
  ],
}
```

Time passes by and an user details page is now in need. So you could go ahead and
filter the list array all the time for a given user entry, assuming a non paginated
endpoint, but it turns out the details page requires a few extra fields that you
don't need for the list page. Perhaps those extra fields are expensive to generate
for multiple objects, so you'd rather not include them in the list endpoint, or you
would rather have the list endpoint as lean as possible. So now, although you could
be altering the _list_ array, you are more likely to just add a _data_ object, such
as in:

```json
{
  list: [
    {...},
    ...
  ],
  data: {
    ...
  }
}
```

_Data_ object that are likely to be used in the user details page only, as if [redux]
was some sort of database. Been there, done that, but not particularly proud of it.

One of the many problems of just using [redux] as a database, therefore tending to
duplicate data in multiple places when convenient, after all [redux] is just a means
to an end, is clearly the fact that you no longer have a single source of truth. In
the event you create yet another user related page, should you read from _list_ or _data_,
when looking for the most up to date version of that something? Oh, but I'm ensuring
that my reducers update both when interacting with the backend. Good, but that's
definitely not foolproof. One of those other reducers of yours might be just
lacking the proper logic to keep them in sync. And now you have outdated data out
there.

Let's say you re-fetch the data while navigating through different pages.
Perhaps this address the outdated data issue, at the expense of extra burden on
the backend, but not everything is about the backend state. What about all the
intermittent state your UI might need, such as draft changes on top of the
backend data or auto-save snapshots? Those might be necessary to
keep, even though you navigated to a different page. What about re-fetching
data only when the backend data has changed? That still does not address the
fact that, given duplication, not all state mirrors backend's data.

So it seems we might be better of avoiding data duplication by referencing ids in
the _list_ array, instead of simply storing whatever payload we get from the backend.
That way a _data_ entry is our single representation of any given user. It goes without
saying that memoization is assumed when pursuing this path, which you should be
employing nevertheless. Back to the reducer shape, one could rightly assume a reducer
shape such as:

```json
{
  list: ['oneId', 'anotherId'],
  data: {
    oneId: {
      ...
    },
    anotherId: {
      ...
    }
  }
}
```

That's already an improvement, but there's more to be done. Naming things properly
for one. _List_ and _data_ keys are not very descriptive. If it was named after the
domain it represents that would be much better. Say:

```json
{
  // userIdOrder, userIdOrdering, ..., are all good alternatives!
  userIds: ['oneId', 'anotherId'],
  userById: {
    oneId: {
      ...
    },
    anotherId: {
      ...
    }
  }
}
```

Small changes, but that keep it easier to reason about the state's content. I
particularly appreciate the _someThingByOtherThing_ pattern, especially because
you might have the need to reference users by other things that not ids. I've
had that need once. That is, to reference an entry by its alias for instance.
So it made sense to maintain a _somethingByAliases_, which naturally would just
reference an id in _somethingById_, so as not to duplicate data. As in:

```json
{
  userIds: ['oneId', 'anotherId'],
  userByAliases: {
    aliasForOneId: 'oneId',
    aliasForAnotherId: 'anotherId',
  },
  userById: {
    oneId: {
      ...
    },
    anotherId: {
      ...
    }
  }
}
```

Naming changes apart, another thing to take into account is where to place
metadata, perhaps without a counterpart in the backend. Think boolean flags,
pagination parameters, and what not. Most often than not the first one that come
to mind is a loading flag or a current state enum. Although those might be
part of the original _userById_ content, I'd rather keep them separate. If not
for anything, for the fact that them changing shouldn't invalidate components
relying on the _userById_ content, especially when memoization is in place.

```json
{
  userIds: ['oneId', 'anotherId'],
  userByAliases: {
    'aliasForOneId': 'oneId',
    'aliasForAnotherId': 'anotherId',
  },
  loadingById: {
    ...
  },
  userById: {
    oneId: {
      ...
    },
    anotherId: {
      ...
    }
  }
}
```

All simple guidelines I follow, which have proved to be useful and future proof
in my own use cases. Does it make sense for you? Do you have your own tips to
share? Please follow up on the comments below.

[redux]: https://redux.js.org/
[thunk]: https://github.com/reduxjs/redux-thunk
[redux saga]: https://github.com/redux-saga/redux-saga
[reselect]: https://github.com/reduxjs/reselect
[immer]: https://github.com/immerjs/immer
[ramda]: https://github.com/ramda/ramda
[normalizr]: https://github.com/paularmstrong/normalizr
[redux data models]: https://github.com/kayak/redux-data-model
