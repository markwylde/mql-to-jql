const compare = require('./helpers/compare');
const testData = compare.testData;

compare({}, '/*', [], testData);

compare({
  query: {
    a: 1
  }
}, '/[[* = :?] = :?]', ['a', 1], [testData[0]]);

compare({
  query: {
    a: {
      $ne: 2
    }
  }
}, '/[[* = :?] != :?]', ['a', 2], [testData[0]]);

compare({
  query: {
    a: {
      $ne: 2
    },
    text: {
      $ne: 'two'
    }
  }
}, '/[[* = :?] != :?] and /[[* = :?] != :?]', ['a', 2, 'text', 'two'], [testData[0]]);

compare({
  query: {
    a: 1,
    text: 'one'
  }
}, '/[[* = :?] = :?] and /[[* = :?] = :?]', ['a', 1, 'text', 'one'], [testData[0]]);
