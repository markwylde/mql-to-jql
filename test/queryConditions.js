const compare = require('./helpers/compare');
const testData = compare.testData;

compare({
  query: {
    $or: [
      { a: 1 },
      { b: 2 }
    ]
  }
}, '(/["a" = :?] or /["b" = :?])', [1, 2], [testData[0], testData[1]]);

compare({
  query: {
    $and: [
      { a: 1 },
      { b: 2 },
      { c: 3 }
    ]
  }
}, '(/["a" = :?] and /["b" = :?] and /["c" = :?])', [1, 2, 3], []);

compare({
  query: {
    $or: [
      {
        a: 1
      },
      {
        $and: [
          { b: 2 },
          { c: 3 }
        ]
      }
    ]
  }
}, '(/["a" = :?] or (/["b" = :?] and /["c" = :?]))', [1, 2, 3], [testData[0]]);
