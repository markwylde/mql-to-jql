const compare = require('./helpers/compare');

compare({
  query: {
    'a[1.0': 1
  }
}, '/"a[1"/["0" = :?]', [1], [
  { 'a[1': [1] },
  { 'a[1': [1, 2] }
], [
  { 'a[1': [1] },
  { 'a[1': [1, 2] },
  { 'a[2': [1] }
]);

compare({
  query: {
    'a"1.0': 1
  }
}, '/"a\\"1"/["0" = :?]', [1], [
  { 'a"1': [1] },
  { 'a"1': [1, 2] }
], [
  { 'a"1': [1] },
  { 'a"1': [1, 2] },
  { 'a"2': [1] }
]);
