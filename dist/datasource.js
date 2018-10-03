System.register(['moment', './lib/host_filter', './lib/helpers'], function(exports_1) {
  var moment, host_filter_1, helpers_1;
  var momentjs, VividCortexDatasource;
  return {
    setters: [
      function(moment_1) {
        moment = moment_1;
      },
      function(host_filter_1_1) {
        host_filter_1 = host_filter_1_1;
      },
      function(helpers_1_1) {
        helpers_1 = helpers_1_1;
      },
    ],
    execute: function() {
      momentjs = moment.default || moment;
      VividCortexDatasource = (function() {
        /** @ngInject */
        function VividCortexDatasource(instanceSettings, backendSrv, templateSrv, $q) {
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
          this.$q = $q;
          this.apiToken = instanceSettings.jsonData.apiToken;
        }
        VividCortexDatasource.prototype.testDatasource = function() {
          var success = {
              status: 'success',
              message: 'Your VividCortex datasource was successfully configured.',
              title: 'Success',
            },
            error = {
              status: 'error',
              message:
                'The configuration test was not successful. Pleaes check your API token and Internet access and try again.',
              title: 'Credentials error',
            };
          return this.doRequest('metrics', 'GET', { limit: 1 }).then(
            function(response) {
              if (response.status === 200) {
                return success;
              }
              return error;
            },
            function() {
              return error;
            }
          );
        };
        VividCortexDatasource.prototype.annotationQuery = function() {
          throw new Error('Annotation support not implemented yet.');
        };
        VividCortexDatasource.prototype.metricFindQuery = function(query) {
          var params = {
            from: momentjs()
              .utc()
              .subtract(24, 'hours')
              .unix(),
            until: momentjs()
              .utc()
              .unix(),
            new: '0',
            filter: query ? '*' + query + '*' : undefined,
            limit: 10,
          };
          return this.doRequest('metrics', 'GET', params)
            .then(function(response) {
              return response.data.data || [];
            })
            .then(function(metrics) {
              return metrics.map(function(metric) {
                return { text: metric.name, value: metric.name };
              });
            })
            .then(function(metrics) {
              return metrics.sort(function(a, b) {
                return a.text === b.text ? 0 : a.text > b.text ? 1 : -1;
              });
            });
        };
        VividCortexDatasource.prototype.query = function(options) {
          var _this = this;
          if (options.targets.length === 0) {
            return this.$q.when({ data: [] });
          }
          var promises = options.targets.map(function(target) {
            options.range.from.utc();
            options.range.to.utc();
            return _this.doQuery(target, options.range.from.unix(), options.range.to.unix(), options.maxDataPoints);
          });
          return this.$q.all(promises).then(function(responses) {
            var result = responses.reduce(function(result, response) {
              return result.concat(response.data);
            }, []);
            return { data: result };
          });
        };
        /* Custom methods ----------------------------------------------------------------------------- */
        /**
         * Get the active hosts in a time interval.
         *
         * @param  {number} from:
         * @param  {number} until
         * @return {Promise}
         */
        VividCortexDatasource.prototype.getActiveHosts = function(from, until) {
          return this.doRequest('hosts', 'GET', {
            from: from,
            until: until,
          }).then(function(response) {
            return response.data.data;
          });
        };
        /**
         * Perform a query-series query for a given target (host and metric) in a time frame.
         *
         * @param  {object} target
         * @param  {number} from
         * @param  {number} until
         * @param  {number} dataPoints
         * @return {Promise}
         */
        VividCortexDatasource.prototype.doQuery = function(target, from, until, dataPoints) {
          var _this = this;
          var params = {
            from: from,
            samplesize: helpers_1.calculateSampleSize(from, until, dataPoints),
            until: until,
            host: null,
            separateHosts: target.separateHosts ? 1 : 0,
          };
          var body = {
            metrics: this.transformMetricForQuery(this.interpolateVariables(target.target)),
          };
          var defer = this.$q.defer();
          this.getActiveHosts(params.from, params.until).then(function(hosts) {
            var filteredHosts = _this.filterHosts(hosts, target.hosts);
            params.host = filteredHosts
              .map(function(host) {
                return host.id;
              })
              .join(',');
            _this
              .doRequest('metrics/query-series', 'POST', params, body)
              .then(function(response) {
                return {
                  metrics: response.data.data || [],
                  from: parseInt(response.headers('X-Vc-Meta-From'), 10),
                  until: parseInt(response.headers('X-Vc-Meta-Until'), 10),
                };
              })
              .then(function(response) {
                defer.resolve(_this.mapQueryResponse(response.metrics, filteredHosts, response.from, response.until));
              })
              .catch(function(error) {
                defer.reject(error);
              });
          });
          return defer.promise;
        };
        /**
         * Interpolate Grafana variables and strip scape characters.
         *
         * @param  {string} metric
         * @return {string}
         */
        VividCortexDatasource.prototype.interpolateVariables = function(metric) {
          if (metric === void 0) {
            metric = '';
          }
          return this.templateSrv.replace(metric, null, 'regex').replace(/\\\./g, '.');
        };
        /**
         * Perform an HTTP request.
         *
         * @param  {string} endpoint
         * @param  {string} method
         * @param  {Object} params
         * @param  {Object} body
         * @return {Promise}
         */
        VividCortexDatasource.prototype.doRequest = function(endpoint, method, params, body) {
          if (params === void 0) {
            params = {};
          }
          if (body === void 0) {
            body = {};
          }
          var options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.apiToken,
            },
            params: params,
            url: 'https://app.vividcortex.com/api/v2/' + endpoint,
            method: method,
            data: body,
          };
          return this.backendSrv.datasourceRequest(options);
        };
        /**
         * Take an array of hosts and apply the configured filters.
         *
         * @param  {Array}  hosts
         * @param  {string} config
         * @return {Array}
         */
        VividCortexDatasource.prototype.filterHosts = function(hosts, config) {
          var filters = host_filter_1.parseFilters(config);
          return hosts.filter(function(host) {
            return host_filter_1.testHost(host, filters);
          });
        };
        /**
         * Prepare the metric to be properly interpreted by the API. E.g. if Grafana is using template
         * variables and requesting multiple metrics.
         *
         * @param  {string} metric
         * @return {string}
         */
        VividCortexDatasource.prototype.transformMetricForQuery = function(metric) {
          if (metric === void 0) {
            metric = '';
          }
          var metrics = metric.replace(/[()]/g, '').split('|');
          if (metrics.length < 2) {
            return metric;
          }
          return metrics.join(',');
        };
        /**
         * Map a VividCortex series response to Grafana's structure.
         *
         * @param  {Array} series
         * @param  {Array} hosts
         * @param  {number} from
         * @param  {number} until
         * @return {Array}
         */
        VividCortexDatasource.prototype.mapQueryResponse = function(series, hosts, from, until) {
          var _this = this;
          if (!series.length || !series[0].elements.length) {
            return { data: [] };
          }
          var response = {
            data: [],
          };
          series.forEach(function(serie) {
            serie.elements.forEach(function(element) {
              var values = element.series;
              var sampleSize = (until - from) / values.length;
              response.data.push({
                target: _this.getTargetNameFromSeries(element, hosts),
                datapoints: values.map(function(value, index) {
                  return [value, (from + index * sampleSize) * 1e3];
                }),
              });
            });
          });
          return response;
        };
        /**
         * From a time series response, return the appropiate label to identify the target in the graph.
         * When the response is divided by host, we use the host name, otherwise the metric name.
         *
         * @param  {Object} series description
         * @param  {Array} series description
         * @return {string}        description
         */
        VividCortexDatasource.prototype.getTargetNameFromSeries = function(series, hosts) {
          if (!series.host) {
            return series.metric;
          }
          var host = hosts.filter(function(host) {
            return host.id === series.host;
          });
          return host.length ? host[0].name : 'Unknown host';
        };
        return VividCortexDatasource;
      })();
      exports_1('default', VividCortexDatasource);
    },
  };
});
//# sourceMappingURL=datasource.js.map
