const fs = require('fs');
const tape = require('basictap');
const { EJDB2 } = require('node-ejdb-lite');

const convert = require('../../convert');
const createQuery = require('../../createQuery');

try {
  fs.rmdirSync('./canhazdata', { recursive: true });
} catch (error) {}
fs.mkdirSync('./canhazdata', { recursive: true });

const defaultTestData = [
  { a: 1, text: 'one' },
  { b: 2, text: 'two' },
  { c: 3, text: 'three' }
];

let id = 0;

function compare (query, expected, values, output, testData = defaultTestData) {
  tape('equality > ' + JSON.stringify(query), async t => {
    t.plan(3);
    id = id + 1;
    const db = await EJDB2.open(`./canhazdata/compare-${id}.db`, { truncate: true });

    for (const item of testData) {
      await db.put('test', item);
    }

    const result = convert(query);

    const q = createQuery(db, 'test', result);
    const recordsRaw = await q.list();
    const records = recordsRaw.map(record => JSON.parse(record._raw));

    await db.close();

    t.equal(result.mql, expected, 'query is ' + result.mql);
    t.deepEqual(result.values, values, 'values are ' + JSON.stringify(result.values));
    t.deepEqual(records.reverse(), output, 'ouput from db was correct');
  });
}

compare.testData = defaultTestData;

module.exports = compare;
