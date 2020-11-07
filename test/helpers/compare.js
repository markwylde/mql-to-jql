const tape = require('tape');
const { EJDB2 } = require('ejdb2_node');

const convert = require('../../');
const createQuery = require('../../createQuery');

const testData = [
  { a: 1, text: 'one' },
  { b: 2, text: 'two' },
  { c: 3, text: 'three' }
];

function compare (query, expected, values, output) {
  tape('equality > ' + JSON.stringify(query), async t => {
    t.plan(3);
    const db = await EJDB2.open('./example.db', { truncate: true });

    await db.put('test', { a: 1, text: 'one' });
    await db.put('test', { b: 2, text: 'two' });
    await db.put('test', { c: 3, text: 'three' });

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

compare.testData = testData;

module.exports = compare;
