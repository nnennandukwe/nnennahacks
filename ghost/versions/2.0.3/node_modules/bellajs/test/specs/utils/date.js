/**
 * Testing
 * @ndaidong
 */
const test = require('tape');
const sinon = require('sinon');

const {
  time,
  now,
} = require('bellajs');

const {variants} = require('../../config');

let isSameTimes = (t1, t2) => {
  return Math.abs(t1 - t2) < 5;
};

const checkDateMethods = (date) => {
  let {
    format,
    relativize,
    local,
    utc,
  } = date;

  test('Testing .time() method', (assert) => {
    let t = (new Date()).getTime();
    let b = time();
    assert.ok(isSameTimes(t, b), 'Time must be the same');
    assert.end();
  });

  test('Testing .date() method', (assert) => {
    let t = new Date();
    let b = now();
    assert.ok(isSameTimes(t.getTime(), b.getTime()), 'Date must be the same');
    assert.end();
  });

  test('With invalid date time input:', (assert) => {
    let check = (t) => {
      let err = new Error('InvalidInput: Number or Date required.');
      assert.throws(() => {
        console.log(format(t)); // eslint-disable-line no-console
      }, err, 'It must throw error if invalid input.');
    };

    [
      '',
      'noop',
      '1988-1-99',
      '4 Thu 15 GMT+0007',
      () => {
        return false;
      },
    ].map(check);

    assert.end();
  });

  test('Testing .format(Number timestamp, String pattern) method:', (assert) => {
    let atime = 1455784100752;

    let samples = [
      {ouput: 'Y/m/d h:i:s', expectation: '2016/02/18 15:28:20'},
      {ouput: 'Y/m/d h:i:s A', expectation: '2016/02/18 03:28:20 PM'},
      {ouput: 'M j, Y h:i:s A', expectation: 'Feb 18, 2016 03:28:20 PM'},
      {ouput: 'l, j F Y h:i:s a', expectation: 'Thursday, 18 February 2016 03:28:20 pm'},
      {ouput: 'w D G O', expectation: '4 Thu 15 GMT+0007'},
      {ouput: 'm/d/y', expectation: '02/18/16'},
      {ouput: 'm/d/y t', expectation: '02/18/16 29'},
      {ouput: 'M jS, Y', expectation: 'Feb 18th, 2016'},
      {
        ouput: 'M jS, Y',
        expectation: 'Feb 21st, 2016',
        input: atime + 3 * 24 * 60 * 6e4,
      },
      {
        ouput: 'M jS, Y',
        expectation: 'Feb 22nd, 2016',
        input: atime + 4 * 24 * 60 * 6e4,
      },
      {
        ouput: 'M jS, Y',
        expectation: 'Feb 23rd, 2016',
        input: atime + 5 * 24 * 60 * 6e4,
      },
    ];

    samples.forEach((sample) => {
      let tpl = sample.ouput;
      let exp = sample.expectation;
      let input = sample.input || atime;
      let result = format(input, tpl);
      assert.deepEqual(result, exp, `"${tpl}" must return ${exp}`);
    });

    assert.throws(() => {
      format(atime, null);
    }, new Error('InvalidInput: Number or Date required.'), 'Throw error if invalid pattern');

    assert.end();
  });

  test('Testing .relativize(Number timestamp) method:', (assert) => {
    let t = time();
    let clock = sinon.useFakeTimers(t);

    // Just now
    setTimeout(() => {
      let r = relativize(t);
      let e = 'Just now';
      assert.deepEqual(r, e, `At the begin it must return ${e}`);
    }, 0);

    // next 3 seconds
    setTimeout(() => {
      let r = relativize(t);
      let e = '3 seconds ago';
      assert.deepEqual(r, e, `After 3 seconds must return ${e}`);
    }, 3000);

    // next 2 minutes
    setTimeout(() => {
      let r = relativize(t);
      let e = '2 minutes ago';
      assert.deepEqual(r, e, `Next 2 minutes must return ${e}`);
    }, 2 * 6e4);

    // next 6 hours
    setTimeout(() => {
      let r = relativize(t);
      let e = '6 hours ago';
      assert.deepEqual(r, e, `Next 6 hours must return ${e}`);
    }, 6 * 60 * 6e4);

    // next 2 days
    setTimeout(() => {
      let r = relativize(t);
      let e = '2 days ago';
      assert.deepEqual(r, e, `Next 2 days must return ${e}`);
    }, 2 * 24 * 60 * 6e4);

    clock.tick(2 * 24 * 60 * 6e4 + 5e3);

    assert.throws(() => {
      relativize('4 Thu 15 GMT+0007');
    }, new Error('InvalidInput: Number or Date required.'), 'Throw error if invalid pattern');

    assert.end();
  });

  test('Testing .utc(Number timestamp) method:', (assert) => {
    let t = 1455784100752;
    let r = utc(t);
    let e = 'Thu, 18 Feb 2016 08:28:20 GMT+0000';
    assert.deepEqual(r, e, `.utc(${t}) must return ${e}`);

    assert.throws(() => {
      utc('4 Thu 15 GMT+0007');
    }, new Error('InvalidInput: Number or Date required.'), 'Throw error if invalid pattern');
    assert.end();
  });


  test('Testing .local(Number timestamp) method:', (assert) => {
    let t = 1455784100000;
    let r = local(t);
    let e = 'Thu, 18 Feb 2016 15:28:20 GMT+0007';
    assert.deepEqual(r, e, `.local(${t}) must return ${e}`);

    assert.throws(() => {
      local('4 Thu 15 GMT+0007');
    }, new Error('InvalidInput: Number or Date required.'), 'Throw error if invalid pattern');
    assert.end();
  });
};

variants.map(checkDateMethods);
