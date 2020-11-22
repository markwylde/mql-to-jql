function createQuery (db, collection, { mql, values }) {
  const q = db.createQuery(mql, collection);

  values.forEach((value, index) => {
    if (typeof value === 'string') {
      q.setString(index, value);
      return;
    }

    if (typeof value === 'boolean') {
      q.setBoolean(index, value);
      return;
    }

    if (typeof value === 'number') {
      q.setNumber(index, value);
    }
  });

  return q;
}

module.exports = createQuery;
