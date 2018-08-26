/**
 * Testing
 * @ndaidong
 */

const test = require('tape');

const {variants} = require('../../config');

// compile
let checkCompile = (bella) => {
  test('Testing .template(String s) method', (assert) => {
    let sample = `
      <article>
        <a href="{link}">{title}</a>
        <p>{content}</p>
        <p>
          <span>{author.name}</span>
          <span>{author.email}</span>
        </p>
      </article>`;

    let data = {
      title: 'Hello world',
      link: 'http://google.com',
      content: 'This is an interesting thing, is that right?',
      author: {
        name: 'Dong Nguyen',
        email: 'ndaidong@gmail.com',
      },
    };

    let expectation = bella.trim(`
      <article>
        <a href="http://google.com">Hello world</a>
        <p>This is an interesting thing, is that right?</p>
        <p>
          <span>Dong Nguyen</span>
          <span>ndaidong@gmail.com</span>
        </p>
      </article>`, true);

    let result = bella.template(sample).compile(data);
    assert.deepEquals(result, expectation, 'Template data must be filled to template string.');

    let r2 = bella.template('ABC').compile(1987);
    assert.deepEquals(r2, 'ABC', 'Return template string if no data');

    assert.end();
  });
};

variants.map(checkCompile);
