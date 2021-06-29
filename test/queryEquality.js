const compare = require('./helpers/compare');
const compareError = require('./helpers/compareError');
const testData = compare.testData;

compare({}, '/*', [], testData);

compare({
  query: {}
}, '/*', [], testData);

compare({
  query: {
    'a1.0': 1
  }
}, '/a1/[0 = :?]', [1], [
  { a1: [1] },
  { a1: [1, 2] }
], [
  { a1: [1] },
  { a1: [1, 2] },
  { a2: [1] }
]);

compare({
  query: {
    'a1.b.c.0': 1
  }
}, '/a1/b/c/[0 = :?]', [1], [
  { a1: { b: { c: [1] } } }
], [
  { a1: { b: { c: [1] } } },
  { a1: { b: { c: [2] } } },
  { a1: { b: { d: [1] } } }
]);

compare({
  query: {
    a: false
  }
}, '/[a = :?]', [false], []);

compare({
  query: {
    a: {
      $ne: 2
    }
  }
}, '/[a != :?]', [2], [testData[0]]);

compare({
  query: {
    c: {
      $gt: 2
    }
  }
}, '/[c > :?]', [2], [testData[2]]);

compare({
  query: {
    b: {
      $lt: 3
    }
  }
}, '/[b < :?]', [3], [testData[1]]);

compare({
  query: {
    a: {
      $ne: 2
    },
    text: {
      $ne: 'two'
    }
  }
}, '/[a != :?] and /[text != :?]', [2, 'two'], [testData[0]]);

compare({
  query: {
    a: 1,
    text: 'one'
  }
}, '/[a = :?] and /[text = :?]', [1, 'one'], [testData[0]]);

compare({
  query: {
    a: {
      $exists: false
    },
    text: 'one'
  }
}, '/* and not /a and /[text = :?]', ['one'], []);

compare({
  query: {
    a: {
      $exists: true
    },
    text: 'one'
  }
}, '/a and /[text = :?]', ['one'], [testData[0]]);

compare({
  query: {
    a: {
      $null: true
    },
    text: 'one'
  }
}, '/* and not /a and /[text = :?]', ['one'], []);

compare({
  query: {
    a: {
      $null: false
    },
    text: 'one'
  }
}, '/a and /[text = :?]', ['one'], [testData[0]]);

compare({
  query: {
    text: {
      $in: ['two', 'three']
    }
  }
}, '/[text in ["two","three"]]', [], [testData[1], testData[2]]);

compare({
  query: {
    text: {
      $nin: ['two', 'three']
    }
  }
}, '/[text not in ["two","three"]]', [], [testData[0]]);

compareError({
  query: {
    b: {
      $invalidCompare: 1
    }
  }
}, 'token "$invalidCompare" is not valid. must be ["$eq","$ne","$gt","$gte","$lt","$lte","$exists","$null","$in","$nin"]');
