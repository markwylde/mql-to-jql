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

    values.push(key);

    function parseEquality (value, token, mql) {
      if (!value[token]) {
        return;
      }

      fields.push(mql);
      values.push(value[token]);
    }

    if (typeof query[key] !== 'object') {
      fields.push('/[[* = :?] = :?]');
      values.push(query[key]);
    } else {
      const allowed = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte'];

      Object.keys(query[key]).forEach(key => {
        if (!allowed.includes(key)) {
          throw new Error(`token "${key}" is not valid. must be ${JSON.stringify(allowed)}`);
        }
      });
    }

    parseEquality(query[key], '$eq', '/[[* = :?] = :?]');
    parseEquality(query[key], '$ne', '/[[* = :?] != :?]');
    parseEquality(query[key], '$gt', '/[[* = :?] > :?]');
    parseEquality(query[key], '$gte', '/[[* = :?] >= :?]');
    parseEquality(query[key], '$lt', '/[[* = :?] < :?]');
    parseEquality(query[key], '$lte', '/[[* = :?] <= :?]');
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
