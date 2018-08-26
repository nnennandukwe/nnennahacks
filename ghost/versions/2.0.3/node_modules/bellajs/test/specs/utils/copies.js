/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

// copies
let checkCopies = (bella) => {
  test('Testing .copies(Object target) method', (assert) => {
    let a = {
      name: 'Toto',
      age: 30,
      level: 8,
      nationality: {
        name: 'America',
      },
    };
    let b = {
      level: 4,
      IQ: 140,
      epouse: {
        name: 'Alice',
        age: 27,
      },
      nationality: {
        name: 'Congo',
        long: '18123.123123.12312',
        lat: '98984771.134231.1234',
      },
    };

    bella.copies(a, b);

    assert.ok(bella.hasProperty(b, 'name'), 'Result must have name');
    assert.ok(bella.hasProperty(b, 'age'), 'Result must have age');
    assert.ok(bella.hasProperty(b, 'level'), 'Result must have level');
    assert.ok(bella.hasProperty(b, 'IQ'), 'Result must have IQ');
    assert.ok(bella.hasProperty(b, 'epouse'), 'Result must have epouse');
    assert.equals(b.level, 8, 'Level must be 8');

    let c = {
      name: 'Kiwi',
      age: 16,
      gender: 'male',
    };
    let d = {
      name: 'Aline',
      age: 20,
    };
    bella.copies(c, d, true, ['age']);
    assert.ok(!bella.hasProperty(d, 'gender'), 'Result must have not gender');
    assert.end();
  });
};

variants.map(checkCopies);
