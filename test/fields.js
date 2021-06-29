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
}, 'key "text{" contains an invalid character');

compareError({
  fields: [
    'tex}t'
  ]
}, 'key "tex}t" contains an invalid character');

compareError({
  fields: [
    ',text'
  ]
}, 'key ",text" contains an invalid character');
