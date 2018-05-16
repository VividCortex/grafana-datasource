/**
 * Transform a string of defined rules to an array of objects describing the filter purpose.
 *
 * @param  {string} config
 * @return {Array}
 */
System.register([], function(exports_1) {
  function parseFilters(config) {
    if (config === void 0) {
      config = '';
    }
    var rawFilters = config.split(' ');
    return rawFilters.map(function(filter) {
      var keyValue = filter.split('=');
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
  function testHost(host, filters) {
    var isExcluded = filters.reduce(function(excluded, filter) {
      if (filter.type === 'exclude' && host.name === filter.value) {
        return true;
      }
      return excluded;
    }, false);
    if (isExcluded) {
      return false;
    }
    return filters.reduce(function(included, filter) {
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
        case 'substring':
          return host.name.indexOf(filter.value) >= 0;
        case 'exclude':
          return true;
        default:
          return included;
      }
    }, false);
  }
  return {
    setters: [],
    execute: function() {
      exports_1('parseFilters', parseFilters);
      exports_1('testHost', testHost);
    },
  };
});
//# sourceMappingURL=host_filter.js.map
