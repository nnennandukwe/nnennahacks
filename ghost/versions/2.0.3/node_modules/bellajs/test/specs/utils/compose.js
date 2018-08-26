/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

let checkCompose = (bella) => {
  let {compose} = bella;

  let f1 = (name) => {
    return `f1 ${name}`;
  };
  let f2 = (name) => {
    return `f2 ${name}`;
  };
  let f3 = (name) => {
    return `f3 ${name}`;
  };

  let addDashes = compose(f1, f2, f3);

  let add3 = (num) => {
    return num + 3;
  };

  let mul6 = (num) => {
    return num * 6;
  };

  let div2 = (num) => {
    return num / 2;
  };

  let sub5 = (num) => {
    return num - 5;
  };

  let calculate = compose(sub5, div2, mul6, add3);

  test('Testing .compose() method', (assert) => {
    let ex = 'f1 f2 f3 Alice';
    assert.deepEquals(addDashes('Alice'), ex, `addDashes('Alice') must return "${ex}"`);

    assert.deepEquals(calculate(5), 19, `calculate(5) must return 19`);
    assert.end();
  });
};

variants.map(checkCompose);
