/**
 * Transform a string of defined rules to an array of objects describing the filter purpose.
 *
 * @param  {string} config
 * @return {Array}
 */

function parseFilters(config: string) {
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
function testHost(host: any, filters: Array<any>) {
  return filters.reduce((included, filter) => {
    if (included) {
      return true;
    } // Once a filter matched, there is no need to keep evaluating

    if (!filter.value) {
      return true;
    } // Include all the hosts by default

    switch (filter.type) {
      case 'attribute':
        return host[filter.key] === filter.value;
      case 'exact':
        return host.name === filter.value;
      case 'exclude':
        return host.name !== filter.value;
      default:
        return host.name.indexOf(filter.value) >= 0;
    }
  }, false);
}

export { parseFilters, testHost };
