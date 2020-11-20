const { EJDB2 } = require('ejdb2_node');
const uuid = require('uuid').v4;

async function main () {
  const db = await EJDB2.open(`./canhazdata/${uuid()}.db`, { truncate: true });

  await db.put('test', { domain: 't' });

  const q = db.createQuery('["t" eq /[domain]]', 'test');

  const recordsRaw = await q.list();
  console.log(recordsRaw);

  db.close();
}

main();
