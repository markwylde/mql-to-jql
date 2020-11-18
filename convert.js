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
      const allowed = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$exists'];

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
    if (query[key].$exists === true) {
      fields.push('/[* = :?]');
    } else if (query[key].$exists === false) {
      fields.push('/* and not /[* = :?]');
    }
  });

  return {
    mql: fields.join(' and '),
    values
  };
}

function parseFields (fields) {
  if (!fields) {
    return {
      mql: '',
      values: []
    };
  }

  fields.forEach(field => {
    if (field.includes('{') || field.includes('}') || field.includes(',')) {
      throw new Error(`field "${field}" can not include brackets or commas`);
    }
  });

  return {
    mql: ` | /{${fields.join(',')}}`,
    values: []
  };
}

function parseOrder (order) {
  if (!order) {
    return {
      mql: '',
      values: []
    };
  }

  order.forEach(item => {
    if (item.includes('{') || item.includes('}') || item.includes(',') || item.includes('|') || item.includes(' ')) {
      throw new Error(`order "${item}" can not include brackets, commas, pipes or spaces`);
    }
  });

  const parsedOrder = order.map(item => {
    const splitted = item.split('(');
    const direction = splitted[0];
    const field = splitted[1].slice(0, -1);

    if (!['asc', 'desc'].includes(direction)) {
      throw new Error(`order "${item}" has an unknown sort direction of "${direction}"`);
    }

    return `${direction} /${field}`;
  });

  return {
    mql: ` | ${parsedOrder.join(' ')}`,
    values: []
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

  const fields = parseFields(options.fields);
  result.mql = result.mql.concat(fields.mql);
  result.values = result.values.concat(fields.values);

  let optionsAlreadyStarted;
  const order = parseOrder(options.order);
  result.mql = result.mql.concat(order.mql);
  result.values = result.values.concat(order.values);
  optionsAlreadyStarted = optionsAlreadyStarted || order.mql.length > 0;

  if (options.skip !== undefined) {
    if (!Number.isInteger(options.skip)) {
      throw new Error(`skip must be a number but received "${options.skip}"`);
    }
    !optionsAlreadyStarted && result.mql.push(' | ');
    result.mql.push(`skip ${options.skip} `);
    optionsAlreadyStarted = true;
  }

  if (options.limit !== undefined) {
    if (!Number.isInteger(options.limit)) {
      throw new Error(`limit must be a number but received "${options.limit}"`);
    }
    !optionsAlreadyStarted && result.mql.push(' | ');
    result.mql.push(`limit ${options.limit} `);
    optionsAlreadyStarted = true;
  }
  console.log({
    mql: result.mql.join('').trim(),
    values: result.values
  });
  return {
    mql: result.mql.join('').trim(),
    values: result.values
  };
}

module.exports = convert;
