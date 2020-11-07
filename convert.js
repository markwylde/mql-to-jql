function parseQuery (query) {
  if (!query) {
    return {
      mql: '/*',
      values: []
    };
  }

  const fields = [];
  let values = [];

  function subQuery (query, join) {
    const subMql = [];
    let subValues = [];
    for (const subQuery of query) {
      const subResult = parseQuery(subQuery);
      subMql.push(subResult.mql);
      subValues = subValues.concat(subResult.values);
    }
    fields.push(`(${subMql.join(join)})`);
    values = values.concat(subValues);
  }

  Object.keys(query).forEach(key => {
    if (key === '$or') {
      subQuery(query[key], ' or ');
      return;
    }

    if (key === '$and') {
      subQuery(query[key], ' and ');
      return;
    }

    fields.push('/[[* = :?] = :?]');
    values.push(key);

    values.push(query[key]);
  });

  return {
    mql: fields.join(' and '),
    values
  };
}

function convert (options) {
  const result = {
    mql: [],
    values: []
  };

  const query = parseQuery(options.query);
  result.mql = result.mql.concat(query.mql);
  result.values = result.values.concat(query.values);

  return {
    mql: result.mql.join(' '),
    values: result.values
  };
}

module.exports = convert;
