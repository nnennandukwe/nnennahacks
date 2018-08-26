const es6Bella = require('../src/main');
const fullBella = require('../dist/bella');
const minBella = require('../dist/bella.min');

module.exports = {
  variants: [es6Bella, fullBella, minBella],
};
