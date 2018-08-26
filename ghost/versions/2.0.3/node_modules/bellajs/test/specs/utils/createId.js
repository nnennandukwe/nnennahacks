/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

// createId
let checkCreateId = (bella) => {
  test('Testing .createId() method', (assert) => {
    let arr = [];
    while (arr.length < 1000) {
      let key = bella.createId();
      assert.deepEquals(key.length, 32, 'key must be a string with 32 chars');
      arr.push(key);
    }

    let uniqArr = bella.unique(arr);
    assert.deepEquals(uniqArr.length, arr.length, 'Every key must be unique');

    let key16 = bella.createId(16);
    assert.deepEquals(key16.length, 16, 'bella.createId(16) must return 16 chars');

    let key24 = bella.createId(24);
    assert.deepEquals(key24.length, 24, 'bella.createId(24) must return 24 chars');

    assert.end();
  });
};

variants.map(checkCreateId);
