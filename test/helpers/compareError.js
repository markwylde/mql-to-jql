const tape = require('basictap');

const convert = require('../../convert');

function compareError (query, expectedError) {
  tape('equality > ' + JSON.stringify(query), async t => {
    t.plan(1);

    try {
      convert(query);
    } catch (error) {
      console.log('asssss', error);
      t.equal(error.message, expectedError);
    }
  });
}

module.exports = compareError;
