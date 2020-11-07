const compare = require('./helpers/compare');
const testData = compare.testData;

compare({}, '/*', [], testData);

compare({
  query: {
    a: 1
  }
}, '/[[* = :?] = :?]', ['a', 1], [testData[0]]);

// compare({
//   query: {
//     a: {
//       $ne: 1
//     }
//   }
// }, '/[[* = :?] != :?]', ['a', 1], [testData[1], testData[2]]);

compare({
  query: {
    a: 1,
    text: 'one'
  }
}, '/[[* = :?] = :?] and /[[* = :?] = :?]', ['a', 1, 'text', 'one'], [testData[0]]);
