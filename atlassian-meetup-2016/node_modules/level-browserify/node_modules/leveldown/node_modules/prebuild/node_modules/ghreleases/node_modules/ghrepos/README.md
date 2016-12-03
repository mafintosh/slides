# ghrepos

<!-- [![Build Status](https://secure.travis-ci.org/rvagg/ghrepos.png)](http://travis-ci.org/rvagg/ghrepos) -->

**A node library to interact with the GitHub repos API**

[![NPM](https://nodei.co/npm/ghrepos.png?mini=true)](https://nodei.co/npm/ghrepos/)

See also:

* https://github.com/rvagg/ghissues
* https://github.com/rvagg/ghusers
* https://github.com/rvagg/ghteams
* https://github.com/rvagg/ghauth

## API

### list(auth[, org][, options], callback)

List all repos for a user or organization. If `org` and `options` are omitted the current user is assumed.

List all repos for user `'rvagg'`:

```js
const ghrepos     = require('ghrepos')
    , authOptions = { user: 'rvagg', token: '24d5dee258c64aef38a66c0c5eca459c379901c2' }

ghrepos.list(authOptions, 'rvagg', function (err, repolist) {
  console.log(reposlist)
})
```

### listRefs(auth, org, repo[, options], callback)

Get git ref data for all refs in a repo.

Get all ref data for `nodejs/io.js` repo:

```js
ghrepos.listRefs(authOptions, 'nodejs', 'io.js', function (err, refData) {
  // data containing ref information including sha and github url
  console.log(refData)
})
```

### getRef(auth, org, repo, ref[, options], callback)

Get git ref data for a particular ref string.

Get git ref data for `v1.x` branch in `nodejs/io.js` repo:

```js
ghrepos.getRef(authOptions, 'nodejs', 'io.js', 'heads/v1.x', function (err, refData) {
  // data containing ref information including sha and github url
  console.log(refData)
})
```

### createLister(type)

Creates a function that lists different sub types related to the `'/repos'` api, e.g. list `'issues'`, `'pulls'` or `'releases'`. The function returned has the signature: `function list (auth, org, repo, options, callback)`.

_More methods coming .. as I need them or as you PR them in._


The auth data is compatible with [ghauth](https://github.com/rvagg/ghauth) so you can just connect them together to make a simple command-line application:

```js
const ghauth     = require('ghauth')
    , ghrepos    = require('ghrepos')
    , authOptions = {
          configName : 'lister'
        , scopes     : [ 'user' ]
      }

ghauth(authOptions, function (err, authData) {
  ghrepos.list(authData, 'rvagg', function (err, list) {
    console.log('Repos for rvagg:')
    console.log(util.inspect(list.map(function (i) { return {
        name: i.name
      , desc: i.description
      , fork: i.fork
    }})))
  })
})
```


## License

**ghrepos** is Copyright (c) 2015 Rod Vagg [@rvagg](https://github.com/rvagg) and licensed under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
