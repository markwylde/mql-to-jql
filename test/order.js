const compare = require('./helpers/compare');
const compareError = require('./helpers/compareError');
const testData = compare.testData;

compare({
  order: [
    'asc(text)'
  ]
}, '/* | asc /text', [], [
  testData[1],
  testData[2],
  testData[0]
]);

compare({
  order: [
    'desc(text)'
  ]
}, '/* | desc /text', [], [
  testData[0],
  testData[2],
  testData[1]

]);

compareError({
  order: [
    'xasc(firstName)'
  ]
}, 'order "xasc(firstName)" has an unknown sort direction of "xasc"');

compareError({
  order: [
    ',text'
  ]
}, 'order ",text" can not include brackets, commas, pipes or spaces');
