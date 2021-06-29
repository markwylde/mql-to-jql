function sanitiseInput (string) {
  const escapedString = string
    .replace(/[,*+\-?^${}()|[\]\\]/g, '\\$&');

  // Ideally, we would just return the sanitised string
  // Waiting for a resolution in ejdb:
  // https://github.com/Softmotions/ejdb/issues/322
  if (escapedString !== string) {
    throw new Error(`key "${string}" contains an invalid character`);
  }

  return string;
}

function parseQuery (query) {
  if (!query || Object.keys(query).length === 0) {
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

    function parseEquality (queryKey, token, mql) {
      if (!queryKey[token]) {
        return;
      }

      fields.push(mql);
      values.push(queryKey[token]);
    }

    const queryKeySplit = sanitiseInput(key)
      .split('.');

    const queryKeyStart = queryKeySplit
      .reduce((queryKey, part, index, array) => {
        if (index === array.length - 1) {
          return queryKey + '[' + part;
        } else {
          return queryKey + part + '/';
        }
      }, '');

    if (typeof query[key] !== 'object') {
      fields.push(`/${queryKeyStart} = :?]`);
      values.push(query[key]);
    } else {
      const allowed = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$exists', '$null', '$in', '$nin'];

      Object.keys(query[key]).forEach(key => {
        if (!allowed.includes(key)) {
          throw new Error(`token "${key}" is not valid. must be ${JSON.stringify(allowed)}`);
        }
      });
    }

    parseEquality(query[key], '$eq', `/${queryKeyStart} = :?]`);
    parseEquality(query[key], '$ne', `/${queryKeyStart} != :?]`);
    parseEquality(query[key], '$gt', `/${queryKeyStart} > :?]`);
    parseEquality(query[key], '$gte', `/${queryKeyStart} >= :?]`);
    parseEquality(query[key], '$lt', `/${queryKeyStart} < :?]`);
    parseEquality(query[key], '$lte', `/${queryKeyStart} <= :?]`);
    if (query[key].$in) {
      fields.push(`/${queryKeyStart} in ${JSON.stringify(query[key].$in)}]`);
    }
    if (query[key].$nin) {
      fields.push(`/${queryKeyStart} not in ${JSON.stringify(query[key].$nin)}]`);
    }
    if (query[key].$exists === true) {
      fields.push(`/${queryKeyStart.slice(1)}`);
    } else if (query[key].$exists === false) {
      fields.push(`/* and not /${queryKeyStart.slice(1)}`);
    }
    if (query[key].$null === false) {
      fields.push(`/${queryKeyStart.slice(1)}`);
    } else if (query[key].$null === true) {
      fields.push(`/* and not /${queryKeyStart.slice(1)}`);
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

  const sanitisedFields = fields.map(sanitiseInput);

  return {
    mql: ` | /{${sanitisedFields.join(',')}}`,
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
    result.mql.push(` skip ${options.skip} `);
    optionsAlreadyStarted = true;
  }

  if (options.limit !== undefined) {
    if (!Number.isInteger(options.limit)) {
      throw new Error(`limit must be a number but received "${options.limit}"`);
    }
    !optionsAlreadyStarted && result.mql.push(' | ');
    result.mql.push(` limit ${options.limit} `);
    optionsAlreadyStarted = true;
  }

  return {
    mql: result.mql.filter(item => !!item).map(item => item.trim()).join(' ').trim(),
    values: result.values
  };
}

module.exports = convert;
