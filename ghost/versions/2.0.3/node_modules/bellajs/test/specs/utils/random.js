/**
 * Testing
 * @ndaidong
 */

const test = require('tape');
const is = require('is');

const {variants} = require('../../config');

// random
let checkRandom = (bella) => {
  test('Testing .random() method', (assert) => {
    const LIMIT = 5;
    assert.comment('Call the result R, it must:');
    let i1 = 0;
    while (i1 < LIMIT) {
      let a = bella.random(50, 70);
      assert.ok(is.number(a), `"${a}" must be number.`);
      assert.ok(a >= 50 && a <= 70, 'bella.random(50, 70): 50 <= R <= 70');
      i1++;
    }

    let i2 = 0;
    while (i2 < LIMIT) {
      let a = bella.random(70, 50);
      assert.ok(is.number(a), `"${a}" must be number.`);
      assert.ok(a >= 50 && a <= 70, 'bella.random(70, 50): 50 <= R <= 70');
      i2++;
    }

    let i3 = 0;
    while (i3 < LIMIT) {
      let a = bella.random(50);
      assert.ok(is.number(a), `"${a}" must be number.`);
      assert.ok(a >= 50 && a <= 9007199254740991, 'bella.random(50): 50 <= R <= 9007199254740991');
      i3++;
    }

    let i4 = 0;
    while (i4 < LIMIT) {
      let a = bella.random();
      assert.ok(is.number(a), `"${a}" must be number.`);
      assert.ok(a >= 0 && a <= 9007199254740991, 'With no parameter, 0 <= R <= 9007199254740991.');
      i4++;
    }

    let x = bella.random(70, 70);
    assert.equals(70, x, 'bella.random(70, 70): R must be 70');
    assert.end();
  });
};

variants.map(checkRandom);
