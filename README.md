# mql-to-jql
![Node.js Test Runner](https://github.com/markwylde/mql-to-jql/workflows/Node.js%20Test%20Runner/badge.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/markwylde/mql-to-jql)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/markwylde/mql-to-jql)](https://github.com/markwylde/mql-to-jql/blob/master/package.json)
[![GitHub](https://img.shields.io/github/license/markwylde/mql-to-jql)](https://github.com/markwylde/mql-to-jql/blob/master/LICENSE)

Convert mql syntax to jql to query ejdb databases

## Installation
```bash
npm install --save mql-to-jql
```

## Example usage
```javascript
const convert = require('mql-to-jql/convert')
const createQuery = require('mql-to-jql/createQuery')

const db = await EJDB2.open('./example.db', { truncate: true });
const query = convert({
  fields: [
    'firstName',
    'lastName'
  ],

 // The following equality operators are implemented:
 // '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$exists', '$null', '$in', '$nin'
  query: {
    $or: [
      { a: 1 },
      { a: 5 },
    ]
  },

  order: [
    'asc(firstName)',
    'desc(lastName)'
  ],

  limit: 10,
  skip: 100
});

/*
You can use query by sending it straight to ejdb.
query === {
  mql: '(/[[* = :?] = :?] or /[[* = :?] = :?])',
  values: ['a', 1, 'a', 5]
}
*/

// OR you can use the createQuery helper to do it for you
const q = createQuery(db, 'testCollection', query);
const records = await q.list();

console.log(records);
```

# License
This project is licensed under the terms of the MIT license.
