/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

let checkStringMethods = (bella) => {
  test('With well-format string input:', (assert) => {
    let methods = [
      'encode',
      'decode',
      'repeat',
      'ucfirst',
      'ucwords',
      'leftPad',
      'rightPad',
      'createAlias',
      'trim',
      'truncate',
      'stripTags',
      'stripAccent',
      'escapeHTML',
      'unescapeHTML',
      'replaceAll',
    ];

    methods.forEach((m) => {
      assert.ok(bella.isFunction(bella[m]), `It must have the method .${m}()`);
    });

    assert.end();
  });

  test('With invalid string input:', (assert) => {
    assert.throws(() => {
      bella.repeat(new Function(), 5); // eslint-disable-line
    }, new Error('InvalidInput: String required.'), 'It must throw an error.');

    assert.end();
  });

  // repeat
  test('Testing .repeat(String s, Number times) method', (assert) => {
    let x = 'hi';
    let a = bella.repeat(x, 5);
    let e = 'hihihihihi';
    assert.deepEquals(a, e, `bella.repeat(x, 5) must return "${e}"`);

    assert.deepEquals(bella.repeat(x), x, `bella.repeat(x) must return "${e}"`);

    assert.throws(() => {
      bella.repeat(x, 268435456);
    },
    new RangeError(`Repeat count must not overflow maximum string size.`),
    `bella.repeat(x, 268435456) must return RangeError`);
    assert.end();
  });

  // encode
  test('Testing .encode(String s) method', (assert) => {
    let x = 'Hello world';
    let a = bella.encode(x);
    let e = 'Hello%20world';
    assert.deepEquals(a, e, `bella.encode(x) must return ${e}`);
    assert.end();
  });

  // decode
  test('Testing .decode(String s) method', (assert) => {
    let x = 'Hello%20world';
    let a = bella.decode(x);
    let e = 'Hello world';
    assert.deepEquals(a, e, `bella.decode(x) must return ${e}`);
    assert.end();
  });

  // trim
  test('Testing .trim(String s) method', (assert) => {
    let x = ' Hello    world. This is   my  dog.  ';
    let a1 = bella.trim(x);
    let e1 = 'Hello    world. This is   my  dog.';
    assert.deepEquals(a1, e1, `bella.trim(x) must return ${e1}`);

    let a2 = bella.trim(x, true);
    let e2 = 'Hello world. This is my dog.';
    assert.deepEquals(a2, e2, `bella.trim(x, true) must return ${e2}`);

    assert.end();
  });

  // truncate
  test('Testing .truncate(String s) method', (assert) => {
    let x = 'If a property is non-configurable, its writable attribute can only be changed to false.';
    let a = bella.truncate(x, 60);
    let e = 'If a property is non-configurable, its writable attribute...';
    assert.deepEquals(a, e, `bella.truncate('${x}', 60) must return "${e}"`);
    assert.deepEquals(bella.truncate(x, 200), x, `bella.truncate('${x}', 200) must return "${x}"`);

    let x1 = [
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      'Lorem Ipsum has been the industry\'s standard dummy text ever since',
      'the 1500s, when an unknown printer took a galley of',
      'type and scrambled it to make a type specimen book.',
    ].join(' ');

    let a1 = bella.truncate(x1);
    let e1 = [
      'Lorem Ipsum is simply dummy text of the printing and typesetting',
      'industry. Lorem Ipsum has been the industry\'s standard dummy text ever...',
    ].join(' ');

    assert.deepEquals(a1, e1, `bella.truncate('${x}') must return "${e1}"`);


    let x2 = 'uyyiyirwqyiyiyrihklhkjhskdjfhkahfiusayiyfiudyiyqwiyriuqyiouroiuyi';
    let a2 = bella.truncate(x2, 20);
    let e2 = 'uyyiyirwqyiyiyrih...';
    assert.deepEquals(a2, e2, `bella.truncate('${x2}', 20) must return "${e2}"`);

    let x3 = 'Lorem Ipsum is simply dummy text';
    let a3 = bella.truncate(x3, 120);
    assert.deepEquals(a3, x3, `bella.truncate('${x3}', 120) must return "${a3}"`);

    assert.end();
  });

  // stripTags
  test('Testing .stripTags(String s) method', (assert) => {
    let x = '<a>Hello <b>world</b></a>';
    let a1 = bella.stripTags(x);
    let e1 = 'Hello world';
    assert.deepEquals(a1, e1, `bella.stripTags('${x}') must return ${e1}`);

    assert.deepEquals(bella.stripTags(1238), '1238', `bella.stripTags(1238) must return "1238"`);
    assert.end();
  });

  // escapeHTML
  test('Testing .escapeHTML(String s) method', (assert) => {
    let x = '<a>Hello <b>world</b></a>';
    let a1 = bella.escapeHTML(x);
    let e1 = '&lt;a&gt;Hello &lt;b&gt;world&lt;/b&gt;&lt;/a&gt;';
    assert.deepEquals(a1, e1, `bella.escapeHTML('${x}') must return ${e1}`);
    assert.end();
  });

  // unescapeHTML
  test('Testing .unescapeHTML(String s) method', (assert) => {
    let x = '&lt;a&gt;Hello &lt;b&gt;world&lt;/b&gt;&lt;/a&gt;';
    let a1 = bella.unescapeHTML(x);
    let e1 = '<a>Hello <b>world</b></a>';
    assert.deepEquals(a1, e1, `bella.unescapeHTML('${x}') must return ${e1}`);
    assert.end();
  });

  // ucfirst
  test('Testing .ucfirst(String s) method', (assert) => {
    let x1 = 'HElLo wOrLd';
    let a1 = bella.ucfirst(x1);
    let e1 = 'Hello world';
    assert.deepEquals(a1, e1, `bella.ucfirst('${x1}') must return ${e1}`);

    let x2 = 'a';
    let a2 = bella.ucfirst(x2);
    let e2 = 'A';
    assert.deepEquals(a2, e2, `bella.ucfirst('${x2}') must return ${e2}`);

    assert.end();
  });

  // ucwords
  test('Testing .ucwords(String s) method', (assert) => {
    let x = 'HElLo wOrLd';
    let a1 = bella.ucwords(x);
    let e1 = 'Hello World';
    assert.deepEquals(a1, e1, `bella.ucwords('${x}') must return ${e1}`);
    assert.end();
  });

  // leftPad
  test('Testing .leftPad(String s, String size, String pad) method', (assert) => {
    let data = [
      {
        s: 7,
        limit: 4,
        pad: '0',
        expect: '0007',
      },
      {
        s: 123456,
        limit: 5,
        pad: '0',
        expect: '123456',
      },
      {
        s: 123456,
        limit: 6,
        pad: '0',
        expect: '123456',
      },
      {
        s: 123456,
        limit: 7,
        pad: '0',
        expect: '0123456',
      },
    ];

    data.forEach((item) => {
      let sample = item.s;
      let limit = item.limit;
      let pad = item.pad;
      let expect = item.expect;

      let result = bella.leftPad(sample, limit, pad);
      assert.deepEquals(result, expect, `bella.leftPad('${sample}', ${limit}, ${pad}) must return ${expect}`);
    });
    assert.deepEquals(bella.leftPad(''), '00', 'bella.leftPad(\'\') must return "00"');
    assert.end();
  });

  // rightPad
  test('Testing .rightPad(String s, String size, String pad) method', (assert) => {
    let data = [
      {
        s: 7,
        limit: 4,
        pad: '0',
        expect: '7000',
      },
      {
        s: 123456,
        limit: 5,
        pad: '0',
        expect: '123456',
      },
      {
        s: 123456,
        limit: 6,
        pad: '0',
        expect: '123456',
      },
      {
        s: 123456,
        limit: 7,
        pad: '0',
        expect: '1234560',
      },
    ];

    data.forEach((item) => {
      let sample = item.s;
      let limit = item.limit;
      let pad = item.pad;
      let expect = item.expect;

      let result = bella.rightPad(sample, limit, pad);
      assert.deepEquals(result, expect, `bella.rightPad('${sample}', ${limit}, ${pad}) must return ${expect}`);
    });
    assert.deepEquals(bella.rightPad(''), '00', 'bella.rightPad(\'\') must return "00"');
    assert.end();
  });

  // replaceAll
  test('Testing .replaceAll(String s, String find, String replace) method', (assert) => {
    let data = [
      {
        input: {
          a: 'Hello world',
          b: 'l',
          c: '2',
        },
        expectation: 'He22o wor2d',
      },
      {
        input: {
          a: 'Hello world',
          b: 'l',
          c: 2,
        },
        expectation: 'He22o wor2d',
      },
      {
        input: {
          a: 798078967,
          b: 7,
          c: 1,
        },
        expectation: '198018961',
      },
      {
        input: {
          a: 'Hello world',
          b: ['l', 'o'],
          c: ['2', '0'],
        },
        expectation: 'He220 w0r2d',
      },
      {
        input: {
          a: 'Hello world',
          b: ['l', 'o'],
          c: '2',
        },
        expectation: 'He222 w2r2d',
      },
      {
        input: {
          a: 'Hello world',
          b: ['l'],
          c: ['2', '0'],
        },
        expectation: 'Hello world',
      },
      {
        input: {
          a: 'Hello world',
          b: 'l',
        },
        expectation: 'Hello world',
      },
      {
        input: {
          a: 'Hello world',
        },
        expectation: 'Hello world',
      },
      {
        input: {
          a: 10000,
        },
        expectation: '10000',
      },
      {
        input: {
          a: 0,
        },
        expectation: '0',
      },
    ];

    data.forEach((useCase) => {
      let input = useCase.input;
      let a = input.a;
      let b = input.b;
      let c = input.c;
      let e = useCase.expectation;

      let result = bella.replaceAll(a, b, c);
      assert.deepEquals(result, e, `bella.replaceAll('${a}', ${b}, ${c}) must return ${e}`);
    });
    assert.end();
  });


  // stripAccent
  test('Testing .stripAccent(String s) method', (assert) => {
    let x1 = 'Sur l\'année 2015 - ủ Ù ỹ Ỹ';
    let a1 = bella.stripAccent(x1);
    let e1 = 'Sur l\'annee 2015 - u U y Y';
    assert.deepEquals(a1, e1, `bella.stripAccent('${x1}') must return ${e1}`);

    let x2 = 12897;
    let a2 = bella.stripAccent(x2);
    let e2 = '12897';
    assert.deepEquals(a2, e2, `bella.stripAccent('${x2}') must return ${e2}`);

    assert.end();
  });

  // createAlias
  test('Testing .createAlias(String s) method', (assert) => {
    let x = 'Sur l\'année 2015';
    let a1 = bella.createAlias(x);
    let e1 = 'sur-l-annee-2015';
    assert.deepEquals(a1, e1, `bella.createAlias('${x}') must return ${e1}`);

    assert.end();
  });
};

variants.map(checkStringMethods);
