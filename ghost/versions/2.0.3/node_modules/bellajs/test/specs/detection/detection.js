/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-empty-function: 0*/
/* eslint no-new-func: 0*/

require('jsdom-global')();

const test = require('tape');
const is = require('is');

const {variants} = require('../../config');

const stringify = (x) => {
  if (is.array(x) || is.object(x)) {
    x = JSON.stringify(x);
  }
  return x;
};

let checkDetection = (bella) => {
  // isElement
  test('Testing .isElement(Anything) method:', (assert) => {
    let doc = window.document;
    let el = doc.createElement('DIV');
    let ra = bella.isElement(el);
    assert.ok(ra, 'Fragment must be an element.');

    [
      'ABC',
      '',
      '100',
      4.2,
      3 / 5,
      0,
      1,
      Math.PI,
      null,
      undefined,
      function x() {},
    ].forEach((item) => {
      let r = bella.isElement(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must be not element.`);
    });
    assert.end();
  });


  // isArray
  test('Testing .isArray(Anything) method:', (assert) => {
    [
      [],
      [
        1,
        2,
        3,
      ],
      new Array(),
      new Array(5),
    ].forEach((item) => {
      let r = bella.isArray(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be an array.`);
    });

    [
      'ABC',
      '',
      '100',
      4.2,
      3 / 5,
      0,
      1,
      Math.PI,
      null,
      undefined,
      function x() {},
    ].forEach((item) => {
      let r = bella.isArray(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must be not array.`);
    });
    assert.end();
  });

  // isObject
  test('Testing .isObject(Anything) method:', (assert) => {
    [
      is,
      {},
      {a: 1, b: 0},
      Object.create({}),
    ].forEach((item) => {
      let r = bella.isObject(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be an object.`);
    });

    [
      100,
      'ABC',
      '',
      null,
      undefined,
      0,
      [],
      new Date(),
    ].forEach((item) => {
      let r = bella.isObject(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must be not object.`);
    });
    assert.end();
  });


  // isString
  test('Testing .isString(Anything) method:', (assert) => {
    [
      'Something',
      '10000',
      '',
      'undefined',
      String(1000),
    ].forEach((item) => {
      let r = bella.isString(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be an string.`);
    });

    [
      false,
      true,
      null,
      undefined,
      Number('1000'),
      0,
    ].forEach((item) => {
      let r = bella.isString(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must be not string.`);
    });

    assert.end();
  });

  // isBoolean
  test('Testing .isBoolean(Anything) method:', (assert) => {
    [
      true,
      2 - 1 === 1,
    ].forEach((item) => {
      let r = bella.isBoolean(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be true.`);
    });

    [
      'ABC',
      '',
      '100',
      4.2,
      3 / 5,
      0,
      1,
      Math.PI,
      null,
      undefined,
      function x() {},
    ].forEach((item) => {
      let r = bella.isBoolean(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must be false.`);
    });
    assert.end();
  });

  // isDate
  test('Testing .isDate(Anything) method:', (assert) => {
    [new Date()].forEach((item) => {
      let r = bella.isDate(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be date.`);
    });

    [
      'ABC',
      '',
      '100',
      4.2,
      3 / 5,
      0,
      1,
      Math.PI,
      null,
      undefined,
      function x() {},
    ].forEach((item) => {
      let r = bella.isDate(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be date.`);
    });
    assert.end();
  });

  // isEmail
  test('Testing .isEmail(Anything) method:', (assert) => {
    [
      'ndaidong@gmail.com',
      'bob.nany@live.com',
      'bob.nany@live.com.vn',
    ].forEach((item) => {
      let r = bella.isEmail(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be email.`);
    });

    [
      'karu@.com',
      'karu',
      'bob.nany@live@com.v',
      '.bob.nany@live@com',
      '',
      undefined,
      0,
    ].forEach((item) => {
      let r = bella.isEmail(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be email.`);
    });
    assert.end();
  });


  // isEmpty
  test('Testing .isEmpty(Anything) method:', (assert) => {
    let something;
    [
      something,
      '',
      {},
      [],
      Object.create({}),
    ].forEach((item) => {
      let r = bella.isEmpty(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be empty.`);
    });

    [
      1,
      true,
      {a: 1},
      [
        1,
        3,
      ],
      function x() {},
    ].forEach((item) => {
      let r = bella.isEmpty(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be empty.`);
    });
    assert.end();
  });

  // isFunction
  test('Testing .isFunction(Anything) method:', (assert) => {
    [
      () => {},
      function x() {},
      new Function(),
    ].forEach((item) => {
      let r = bella.isFunction(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be function.`);
    });

    let something;
    [
      1,
      true,
      {a: 1},
      [
        1,
        3,
      ],
      something,
      '',
      {},
      [],
      Object.create({}),
    ].forEach((item) => {
      let r = bella.isFunction(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be function.`);
    });
    assert.end();
  });


  // isInteger
  test('Testing .isInteger(Anything) method:', (assert) => {
    [
      6e4,
      9,
      0,
    ].forEach((item) => {
      let r = bella.isInteger(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be integer.`);
    });

    [
      'ABC',
      '',
      '100',
      4.2,
      3 / 5,
      Math.PI,
      null,
      undefined,
    ].forEach((item) => {
      let r = bella.isInteger(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be integer.`);
    });
    assert.end();
  });


  // isLetter
  test('Testing .isLetter(Anything) method:', (assert) => {
    [
      'abc',
      'ABC',
      'AbCd',
    ].forEach((item) => {
      let r = bella.isLetter(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be letter.`);
    });

    [
      ')jki',
      'karu_',
      'bob.nany@',
      '-asd',
      '',
      undefined,
      0,
      1325,
      4.2,
      3 / 5,
      Math.PI,
      null,
      undefined,
    ].forEach((item) => {
      let r = bella.isLetter(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be letter.`);
    });
    assert.end();
  });


  // isNumber
  test('Testing .isNumber(Anything) method:', (assert) => {
    [
      4.2,
      3 / 5,
      6e4,
      Math.PI,
      9,
      0,
    ].forEach((item) => {
      let r = bella.isNumber(item);
      let x = stringify(item);
      assert.ok(r, `"${x}" must be number.`);
    });

    [
      ')jki',
      '',
      '100',
      null,
      undefined,
      new Function(),
    ].forEach((item) => {
      let r = bella.isNumber(item);
      let x = stringify(item);
      assert.error(r, `"${x}" must not be number.`);
    });
    assert.end();
  });

  // hasProperty
  test('Tesing .hasProperty(Object o, String propertyName) method:', (assert) => {
    let sample = {
      name: 'lemond',
      age: 15,
      group: null,
      label: 'undefined',
      color: 0,
    };

    let props = [
      'name',
      'age',
      'group',
      'label',
      'color',
    ];
    for (let i = 0; i < props.length; i++) {
      let k = props[i];
      assert.ok(bella.hasProperty(sample, k), `"${k}" must be recognized.`);
    }

    let fails = [
      'class',
      'year',
      'prototype',
      '__proto__',
      'toString',
    ];
    for (let i = 0; i < fails.length; i++) {
      let k = fails[i];
      assert.error(bella.hasProperty(sample, k), `"${k}" must be unrecognized.`);
    }

    assert.error(bella.hasProperty({a: 1}), 'Return false if missing k');
    assert.error(bella.hasProperty(), 'Return false if no parameter');
    assert.end();
  });

  // equals
  test('Tesing .equals(Anything a, Anything b) method:', (assert) => {
    let t = new Date();
    let a1 = [
      {},
      [],
      0,
      'a',
      [
        1,
        4,
        6,
        8,
      ],
      {
        a: 1,
        b: 4,
        c: 6,
      },
      t,
    ];
    let b1 = [
      {},
      [],
      0,
      'a',
      [
        1,
        4,
        6,
        8,
      ],
      {
        c: 6,
        b: 4,
        a: 1,
      },
      t,
    ];

    for (let i = 0; i < a1.length; i++) {
      let a = a1[i];
      let b = b1[i];
      let result = bella.equals(a, b);
      let as = stringify(a);
      let bs = stringify(b);
      assert.ok(result, `"${as}" must be equal to ${bs}.`);
    }


    let at = new Date();
    let bt = new Date(at.getTime() - 1000);
    let a2 = [
      {x: 5},
      [
        11,
        66,
        'ab',
      ],
      0,
      'a',
      [
        1,
        4,
        6,
        8,
      ],
      {
        a: 1,
        b: 4,
        c: 6,
      },
      at,
    ];
    let b2 = [
      {},
      ['ab'],
      8,
      'b',
      [
        1,
        6,
        4,
        8,
      ],
      {
        c: 6,
        b: 4,
        a: 2,
      },
      bt,
    ];

    for (let i = 0; i < a2.length; i++) {
      let a = a2[i];
      let b = b2[i];
      let result = bella.equals(a, b);
      let as = stringify(a);
      let bs = stringify(b);
      assert.error(result, `"${as}" must be not equal to ${bs}.`);
    }

    assert.end();
  });
};

variants.map(checkDetection);
