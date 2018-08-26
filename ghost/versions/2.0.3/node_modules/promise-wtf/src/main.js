/**
 * Promise
 * Lightweight Promise implementation with the 'finally' method
 * @ndaidong
**/

const ENV = typeof module !== 'undefined' && module.exports ? 'node' : 'browser';

const PENDING = 0;
const REJECTED = 1;
const RESOLVED = 2;

var isFunction = (v) => {
  return v && {}.toString.call(v) === '[object Function]';
};

class P {

  constructor(fn) {

    let _state = PENDING;
    let _deferred = null;
    let _value;

    let self = this; // eslint-disable-line consistent-this

    let handle = (instance) => {

      if (_state === PENDING) {
        _deferred = instance;
        return false;
      }

      let cb = _state === RESOLVED ? instance.onResolved : instance.onRejected;

      if (!cb) {
        return _state === RESOLVED ? instance.resolve(_value) : instance.reject(_value);
      }

      return instance.resolve(cb(_value));
    };

    let reject = (reason) => {
      _state = REJECTED;
      _value = reason;

      if (_deferred) {
        handle(_deferred);
      }
    };

    let resolve = (instance) => {
      if (instance && isFunction(instance.then)) {
        instance.then(resolve, reject);
        return;
      }
      _state = RESOLVED;
      _value = instance;

      if (_deferred) {
        handle(_deferred);
      }
    };

    self.then = (onResolved, onRejected) => {
      return new P((_resolve, _reject) => {
        return handle({
          onResolved,
          onRejected,
          resolve: _resolve,
          reject: _reject
        });
      });
    };

    self['catch'] = (onRejected) => { // eslint-disable-line dot-notation
      return self.then(null, onRejected);
    };

    return fn(resolve, reject);
  }

  static resolve(value) {
    return new P((resolve) => {
      return resolve(value);
    });
  }

  static reject(value) {
    return new P((resolve, reject) => {
      return reject(value);
    });
  }

  static all(promises) {

    let results = [];
    let done = P.resolve(null);

    promises.forEach((promise) => {
      done = done.then(() => {
        return promise;
      }).then((value) => {
        results.push(value);
      });
    });
    return done.then(() => {
      return results;
    });
  }
}

var root = ENV === 'node' ? global : window;

var $P = root.Promise || P;

$P.prototype['finally'] = function (func) {
  return this.then((value) => {
    return $P.resolve(func()).then(() => {
      return value;
    });
  });
};

$P.series = (tasks) => {
  return new $P((resolve, reject) => {
    let t = tasks.length;
    let exec = (k) => {
      tasks[k]((err) => {
        if (err) {
          return reject(err);
        }
        if (k < t - 1) {
          return exec(k + 1);
        }
        return resolve();
      });
    };
    return exec(0);
  });
};

module.exports = $P;
