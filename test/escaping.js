// const compare = require('./helpers/compare');
const compareError = require('./helpers/compareError');

compareError({
  query: {
    'a[1.0': 1
  }
}, 'key "a[1.0" contains an invalid character');

// compare({
//   query: {
//     'a[1.0': 1
//   }
// }, '/a\\[1/[0 = :?]', [1], [
//   { ['a[1']: [ 1 ] },
//   { ['a[1']: [ 1, 2 ] }
// ], [
//   { ['a[1']: [ 1 ] },
//   { ['a[1']: [ 1, 2 ] },
//   { ['a[2']: [ 1 ] }
// ]);
