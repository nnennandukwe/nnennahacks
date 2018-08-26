/**
 * Testing
 * @ndaidong
 */

var test = require('tape');

var root = global;
root.Promise = false;

var PromiseMain = require('../../src/main');
var PromiseFull = require('../../dist/promise-wtf');
var PromiseMin = require('../../dist/promise-wtf.min');

var promiseTest = (_Promise) => {
  var hasMethod = (ob, m) => {
    return ob[m] && typeof ob[m] === 'function';
  };

  var fakeAsyncRead = (text, callback) => {
    let t = Math.random() * 1000;
    setTimeout(() => {
      if (!text) {
        return callback(new Error('Expected a string'));
      }
      return callback(null, text);
    }, 200 + t);
  };

  var fakePromiseRead = (text) => {
    return new _Promise((resolve, reject) => {
      return fakeAsyncRead(text, (err, content) => {
        if (err) {
          return reject(err);
        }
        return resolve(content);
      });
    });
  };

  test('Testing Promise constructor', (assert) => {

    let instance = fakePromiseRead('Hello world');

    assert.ok(hasMethod(instance, 'then'), 'Promise instance must have "then" method');
    assert.ok(hasMethod(instance, 'catch'), 'Promise instance must have "catch" method');
    assert.ok(hasMethod(instance, 'finally'), 'Promise instance must have "finally" method');
    assert.end();
  });

  test('Testing Promise result after then', (assert) => {

    let instance = fakePromiseRead('Hello');

    instance.then((s) => {
      assert.deepEquals(s, 'Hello', 'It must return content');
    }).catch((e) => {
      console.log(e);
    }).finally(() => {
      assert.end();
    });
  });

  test('Testing Promise.all', (assert) => {
    _Promise.all([
      fakePromiseRead('One'),
      fakePromiseRead('Two'),
      fakePromiseRead('Three'),
      fakePromiseRead('Four'),
      fakePromiseRead('Five'),
      fakePromiseRead('Six'),
      fakePromiseRead('Seven'),
      fakePromiseRead('Eight'),
      fakePromiseRead('Nine'),
      fakePromiseRead('Ten')
    ]).then((results) => {
      let s = results.join(' ');
      let r = 'One Two Three Four Five Six Seven Eight Nine Ten';
      assert.deepEquals(s, r, `It must return ${r}`);
      assert.end();
    });
  });

  test('Testing Promise.series', (assert) => {
    let arr = [];
    _Promise.series([
      (next) => {
        let t = 'One';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Two';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Three';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Four';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Five';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Six';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Seven';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Eight';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Nine';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Ten';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      }
    ]).then(() => {
      let s = arr.join(' ');
      let r = 'One Two Three Four Five Six Seven Eight Nine Ten';
      assert.deepEquals(s, r, `It must return ${r}`);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      assert.end();
    });
  });

  test('Testing Promise.series fail', (assert) => {
    let arr = [];
    _Promise.series([
      (next) => {
        let t = 'One';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Two';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Three';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = null;
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      },
      (next) => {
        let t = 'Five';
        fakeAsyncRead(t, (err, content) => {
          if (!err && content) {
            arr.push(content);
          }
          next(err, content);
        });
      }
    ]).then(() => {
      assert.deepEquals(null, null, 'Nothing here');
    }).catch((error) => {
      assert.deepEquals(error, new Error('Expected a string'), 'It must return error here');
    }).finally(() => {
      assert.end();
    });
  });

  test('Testing Promise.reject', (assert) => {
    _Promise.reject(new Error('fail')).then((data) => {
      assert.deepEquals(data, null, 'Nothing here');
    }, (error) => {
      assert.deepEquals(error, new Error('[Error: fail]'), 'It must return error here');
      assert.end();
    });
  });

  test('Testing Promise.resolve', (assert) => {
    _Promise.resolve('Success').then((value) => {
      assert.deepEquals(value, 'Success', 'It must return "Success"');
    }, (data) => {
      assert.deepEquals(data, null, 'Nothing here');
    });

    var p = _Promise.resolve([1, 2, 3]);
    p.then((v) => {
      assert.deepEquals(v[0], 1, 'It must return 1 here');
    });
    var original = _Promise.resolve(true);
    var cast = _Promise.resolve(original);
    cast.then((v) => {
      assert.deepEquals(v, true, 'It must return true here');
    });

    assert.end();
  });
};

[PromiseMain, PromiseFull, PromiseMin].map(promiseTest);
