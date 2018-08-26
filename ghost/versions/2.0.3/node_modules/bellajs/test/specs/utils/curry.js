/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

let checkCurry = (bella) => {
  let curry = bella.curry;
  let isGreaterThan = curry((limit, value) => {
    return value > limit;
  });

  let sum3 = curry((a, b, c) => {
    return a + b + c;
  });

  test('Testing .curry() method', (assert) => {
    assert.deepEquals(isGreaterThan(10)(20), true, `isGreaterThan(10)(20) must return true`);
    assert.deepEquals(isGreaterThan(30)(20), false, `isGreaterThan(30)(20) must return false`);
    let greaterThanTen = isGreaterThan(10);
    assert.deepEquals(greaterThanTen(20), true, `greaterThanTen(20) must return true`);

    assert.deepEquals(sum3(3)(2)(1), 6, `sum3(3)(2)(1) must return 6`);
    assert.deepEquals(sum3(1)(2)(3), 6, `sum3(1)(2)(3) must return 6`);
    assert.deepEquals(sum3(1, 2)(3), 6, `sum3(1, 2)(3) must return 6`);
    assert.deepEquals(sum3(1)(2, 3), 6, `sum3(1)(2, 3) must return 6`);
    assert.deepEquals(sum3(1, 2, 3), 6, `sum3(1, 2, 3) must return 6`);

    assert.ok(bella.isFunction(sum3(1, 2)), `sum3(1, 2) must be a function`);
    assert.end();
  });
};

variants.map(checkCurry);
