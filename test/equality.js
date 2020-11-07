const compare = require('./helpers/compare');
const compareError = require('./helpers/compareError');
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
    c: {
      $gt: 2
    }
  }
}, '/[[* = :?] > :?]', ['c', 2], [testData[2]]);

compare({
  query: {
    b: {
      $lt: 3
    }
  }
}, '/[[* = :?] < :?]', ['b', 3], [testData[1]]);

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

// compare({
//   query: {
//     a: {
//       $exists: false
//     },
//     text: 'one'
//   }
// }, '/[[* = :?] = :?] and /[[* = :?] = :?]', ['a', 'text', 'one'], []);

compare({
  query: {
    a: {
      $exists: true
    },
    text: 'one'
  }
}, '/[* = :?] and /[[* = :?] = :?]', ['a', 'text', 'one'], [testData[0]]);


compareError({
  query: {
    b: {
      $invalidCompare: 1
    }
  }
}, 'token "$invalidCompare" is not valid. must be ["$eq","$ne","$gt","$gte","$lt","$lte","$exists"]');
