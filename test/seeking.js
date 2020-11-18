const compare = require('./helpers/compare');
const compareError = require('./helpers/compareError');
const testData = compare.testData;

compare({
  skip: 2
}, '/* | skip 2', [], [
  testData[0]
]);

compare({
  limit: 1
}, '/* | limit 1', [], [
  testData[2]
]);

compare({
  skip: 1,
  limit: 1
}, '/* | skip 1 limit 1', [], [
  testData[1]
]);

compareError({
  skip: 'a',
  limit: 10
}, 'skip must be a number but received "a"');

compareError({
  skip: 0,
  limit: 'b'
}, 'limit must be a number but received "b"');
