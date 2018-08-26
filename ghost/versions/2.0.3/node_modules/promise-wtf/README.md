# promise-wtf
Lightweight Promise implementation **w**ith **t**he "**f**inally" method

[![NPM](https://badge.fury.io/js/promise-wtf.svg)](https://badge.fury.io/js/promise-wtf)
[![Build Status](https://travis-ci.org/ndaidong/promise-wtf.svg?branch=master)](https://travis-ci.org/ndaidong/promise-wtf)
[![codecov](https://codecov.io/gh/ndaidong/promise-wtf/branch/master/graph/badge.svg)](https://codecov.io/gh/ndaidong/promise-wtf)
[![Dependency Status](https://gemnasium.com/badges/github.com/ndaidong/promise-wtf.svg)](https://gemnasium.com/github.com/ndaidong/promise-wtf)
[![NSP Status](https://nodesecurity.io/orgs/techpush/projects/057d6386-964c-4d64-abe8-79845fa56f9d/badge)](https://nodesecurity.io/orgs/techpush/projects/057d6386-964c-4d64-abe8-79845fa56f9d)


## Why

Native Promise in ECMAScript 2015 came without "finally" while this method is really useful in many cases.

For an instance, let's start with the following script:

```
var Article = require('../models/Article');

export var home = (req, res) => {

  let query = req.query || {};
  let skip = query.skip || 0;
  let limit = query.limit || 10;

  let data = {
    error: 0,
    entries: []
  };
```

I don't think that's good to write something like this:

```
  return Article.list(skip, limit).then((result) => {
    data.entries = result;
    res.render('landing', data);
  }).catch((err) => {
    data.error = err;
    res.render('landing', data);
  });
};
```

However, it's better to have "finally" there:

```
  return Article.list(skip, limit).then((result) => {
    data.entries = result;
  }).catch((err) => {
    data.error = err;
  }).finally(() => {
    res.render('landing', data);
  });
};
```

Unfortunately, "finally" is only available in some libraries such as Bluebird, or Q+, those are quite heavy to load for client side usage. What I need is just a basic prototype, a simple polyfill with "finally" implemented.


## What's different?

This variant inherits the native [Promise object's prototype](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) if any. Otherwise, it provides Promise constructor and 3 static methods:

- [Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [Promise.reject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
- [Promise.all](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

In addition, there is also [Promise.series](https://github.com/ndaidong/promise-wtf/issues/2) method that works as same as [async.series](https://github.com/caolan/async#seriestasks-callback) but follows Promise style, for example:

```
var Promise = require('promise-wtf');

Promise.series([
  (next) => {
    setTimeout(next, 300);
  },
  (next) => {
    setTimeout(next, 100);
  },
  (next) => {
    setTimeout(next, 500);
  },
  (next) => {
    setTimeout(next, 2000);
  },
  (next) => {
    setTimeout(next, 1000);
  }
]).then(() => {
  console.log('Promise.series: then');
}).catch((err) => {
  console.log('Promise.series: catch');
  console.log(err);
}).finally(() => {
  console.log('Promise.series: finally');
});
```

## How

- Node.js

  ```
  npm install promise-wtf
  ```

- CDN

  - [promise-wtf.js](https://cdn.rawgit.com/ndaidong/promise-wtf/master/dist/promise-wtf.js)
  - [promise-wtf.min.js](https://cdn.rawgit.com/ndaidong/promise-wtf/master/dist/promise-wtf.min.js)
  - [promise-wtf.min.map](https://cdn.rawgit.com/ndaidong/promise-wtf/master/dist/promise-wtf.min.map)

- Also supports ES6 Module, CommonJS, AMD and UMD style.


## Test

```
git clone https://github.com/ndaidong/promise-wtf.git
cd promise-wtf
npm install
npm test

// run Promises/A+ Compliance Test Suite
npm run aplus
```

# License

The MIT License (MIT)
