const compare = require('./helpers/compare');
const testData = compare.testData;

compare({
  query: {
    $or: [
      { a: 1 },
      { b: 2 }
    ]
  }
}, '(/[[* = :?] = :?] or /[[* = :?] = :?])', ['a', 1, 'b', 2], [testData[0], testData[1]]);

compare({
  query: {
    $or: [
      { a: 1 },
      { b: 2 },
      { c: 3 }
    ]
  }
}, '(/[[* = :?] = :?] or /[[* = :?] = :?] or /[[* = :?] = :?])', ['a', 1, 'b', 2, 'c', 3], testData);

compare({
  query: {
    $and: [
      { a: 1 },
      { b: 2 },
      { c: 3 }
    ]
  }
}, '(/[[* = :?] = :?] and /[[* = :?] = :?] and /[[* = :?] = :?])', ['a', 1, 'b', 2, 'c', 3], []);

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
}, '(/[[* = :?] = :?] or (/[[* = :?] = :?] and /[[* = :?] = :?]))', ['a', 1, 'b', 2, 'c', 3], [testData[0]]);
