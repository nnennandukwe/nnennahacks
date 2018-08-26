/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

// clone
let checkClone = (bella) => {
  test('Testing .clone(Object target) method', (assert) => {
    assert.comment('Clone object');
    let a = {
      level: 4,
      IQ: 140,
      epouse: {
        name: 'Alice',
        age: 27,
      },
      birthday: new Date(),
      a: 0,
      clone: false,
      reg: /^\w+@\s([a-z])$/gi,
    };

    let ca = bella.clone(a);
    assert.ok(bella.hasProperty(ca, 'level'), 'ca must have level');
    assert.ok(bella.hasProperty(ca, 'IQ'), 'ca must have IQ');
    assert.ok(bella.hasProperty(ca, 'epouse'), 'ca must have epouse');
    assert.ok(bella.hasProperty(ca, 'birthday'), 'ca must have birthday');
    assert.ok(bella.hasProperty(ca, 'reg'), 'ca must have reg');


    assert.comment('Clone array');
    let b = [
      1,
      5,
      0,
      'a',
      -10,
      '-10',
      '',
      {
        a: 1,
        b: 'Awesome',
      },
      [
        5,
        6,
        8,
        {
          name: 'Lys',
          age: 11,
        },
      ],
    ];

    let cb = bella.clone(b);
    assert.ok(b.length === cb.length, 'cb.length === b.length');
    assert.ok(bella.equals(b, cb), 'cb === b');

    cb[7].a = 2;
    cb[7].b = 'Noop';

    assert.ok(b[7].a === 1 && b[7].b === 'Awesome', 'Cloned item must be immutable');

    assert.comment('Clone nothing');
    assert.error(bella.clone(), 'Clone nothing must return nothing');

    assert.end();
  });
};

variants.map(checkClone);
