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
    var negativeFilters = filters.filter(function(filter) {
      return filter.type === 'exclude';
    });
    var positiveFilters = filters.filter(function(filter) {
      return filter.type !== 'exclude';
    });
    for (var _i = 0; _i < negativeFilters.length; _i++) {
      var filter = negativeFilters[_i];
      if (passesFilter(host, filter) === false) {
        return false;
      }
    }
    for (var _a = 0; _a < positiveFilters.length; _a++) {
      var filter = positiveFilters[_a];
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
  return {
    setters: [],
    execute: function() {
      exports_1('parseFilters', parseFilters);
      exports_1('testHost', testHost);
    },
  };
});
//# sourceMappingURL=host_filter.js.map
