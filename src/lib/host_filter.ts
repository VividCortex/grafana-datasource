/**
 * Transform a string of defined rules to an array of objects describing the filter purpose.
 *
 * @param  {string} config
 * @return {Array}
 */

function parseFilters(config: string = '') {
  const rawFilters = config.split(' ');

  return rawFilters.map(filter => {
    const keyValue = filter.split('=');

    if (keyValue.length === 2) {
      return {
        type: 'attribute',
        key: keyValue[0],
        value: keyValue[1],
      };
    }

    if (filter.match(/^"(.*?)"$/)) {
      return {
        type: 'exact',
        value: filter.replace(/^"+|"+$/g, ''),
      };
    }

    if (filter.match(/^-"(.*?)"$/)) {
      return {
        type: 'exclude',
        value: filter.replace(/^\-"+|"+$/g, ''),
      };
    }

    return {
      type: 'substring',
      value: filter,
    };
  });
}

/**
 * Apply an array of filter rules to a host. True means the host passes the filters.
 *
 * @param  {object} host
 * @param  {Array} filters
 * @return {boolean}
 */
function testHost(host: any, filters: any[]) {
  const negativeFilters = filters.filter(filter => filter.type === 'exclude');
  const positiveFilters = filters.filter(filter => filter.type !== 'exclude');

  for (const filter of negativeFilters) {
    if (passesFilter(host, filter) === false) {
      return false;
    }
  }

  for (const filter of positiveFilters) {
    if (passesFilter(host, filter)) {
      return true;
    }
  }

  return positiveFilters.length > 0 ? false : true;
}

function passesFilter(host, filter) {
  switch (filter.type) {
    case 'attribute':
      return host[filter.key] === filter.value;
    case 'exact':
      return host.name === filter.value;
    case 'substring':
      return host.name.indexOf(filter.value) >= 0;
    case 'exclude':
      return host.name !== filter.value;
    default:
      return true;
  }
}

export { parseFilters, testHost };
