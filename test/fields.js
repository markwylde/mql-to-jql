const compare = require('./helpers/compare');
const compareError = require('./helpers/compareError');
const testData = compare.testData;

compare({
  fields: [
    'text'
  ]
}, '/* | /{text}', [], [
  { text: testData[0].text },
  { text: testData[1].text },
  { text: testData[2].text }
]);

compareError({
  fields: [
    'text{'
  ]
}, 'field "text{" can not include brackets or commas');

compareError({
  fields: [
    'tex}t'
  ]
}, 'field "tex}t" can not include brackets or commas');

compareError({
  fields: [
    ',text'
  ]
}, 'field ",text" can not include brackets or commas');
