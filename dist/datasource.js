///<reference path='../node_modules/grafana-sdk-mocks/app/headers/common.d.ts' />
System.register([], function(exports_1) {
    var VividCortexMetricsDatasource;
    return {
        setters:[],
        execute: function() {
            VividCortexMetricsDatasource = (function () {
                /** @ngInject */
                function VividCortexMetricsDatasource(instanceSettings, backendSrv, templateSrv, $q) {
                    this.backendSrv = backendSrv;
                    this.templateSrv = templateSrv;
                    this.$q = $q;
                    this.org = instanceSettings.jsonData.org;
                    this.apiToken = instanceSettings.jsonData.apiToken;
                }
                VividCortexMetricsDatasource.prototype.query = function (options) {
                    var _this = this;
                    var parameters = this.getQueryParameters(options);
                    if (!parameters) {
                        return this.$q.when({ data: [] });
                    }
                    var params = {
                        from: parameters.params.from,
                        rank: 1,
                        samplesize: 12,
                        until: parameters.params.until,
                        host: parameters.hosts,
                    };
                    var body = {
                        metrics: parameters.metric,
                    };
                    return this.doRequest('metrics/query-series', 'POST', params, body)
                        .then(function (response) { return ({ metrics: response.data.data || [], from: parseInt(response.headers('X-Vc-Meta-From')), until: parseInt(response.headers('X-Vc-Meta-Until')) }); })
                        .then(function (response) {
                        return _this.mapQueryResponse(response.metrics, response.from, response.until);
                    });
                };
                VividCortexMetricsDatasource.prototype.annotationQuery = function (options) {
                    throw new Error('Annotation support not implemented yet.');
                };
                VividCortexMetricsDatasource.prototype.metricFindQuery = function (query) {
                    var _this = this;
                    if (this.metrics) {
                        return this.filterMetrics(this.metrics, query);
                    }
                    return this.doRequest('metrics', 'GET')
                        .then(function (response) { return response.data.data || []; })
                        .then(function (metrics) { return metrics.map(function (metric) { return ({ text: metric.name, value: metric.name }); }); })
                        .then(function (metrics) {
                        _this.metrics = metrics;
                        return _this.filterMetrics(metrics, query);
                    });
                };
                VividCortexMetricsDatasource.prototype.testDatasource = function () {
                    var success = {
                        status: 'success',
                        message: 'Your VividCortex datasource was successfully configured.',
                        title: 'Success'
                    }, error = {
                        status: 'error',
                        message: 'The API token or organization name are incorrect.',
                        title: 'Credentials error'
                    };
                    return this.doRequest('metrics', 'GET', { limit: 1 })
                        .then(function (response) {
                        if (response.status === 200) {
                            return success;
                        }
                        return error;
                    }, function () {
                        return error;
                    });
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
                VividCortexMetricsDatasource.prototype.doRequest = function (endpoint, method, params, body) {
                    if (params === void 0) { params = {}; }
                    if (body === void 0) { body = {}; }
                    var options = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.apiToken,
                        },
                        params: params,
                        url: 'https://' + this.org + '.app.vividcortex.com/api/v2/' + endpoint,
                        method: method,
                        data: body,
                    };
                    return this.backendSrv.datasourceRequest(options);
                };
                /**
                 * Takes a Grafana query object and returns an object with the required information to query
                 * VividCortex, or null if there is an error or no selected metrics.
                 *
                 * @param  {Object} options Grafana options object
                 * @return {Object|null}
                 */
                VividCortexMetricsDatasource.prototype.getQueryParameters = function (options) {
                    var metric = options.targets.reduce(function (metric, target) {
                        return target.target != 'select metric' ? target.target : metric;
                    }, null);
                    var hosts = options.targets.reduce(function (hosts, target) {
                        return target.target != 'select metric' ? target.hosts : hosts;
                    }, null);
                    if (!metric) {
                        return null;
                    }
                    return {
                        metric: metric,
                        hosts: '0,' + hosts,
                        params: {
                            from: options.range.from.unix(),
                            until: options.range.to.unix()
                        },
                    };
                };
                /**
                 * Maps a VividCortex series response to Grafana's structure.
                 *
                 * @param  {Array} series
                 * @param  {number} from
                 * @param  {number} until
                 * @return {Array}
                 */
                VividCortexMetricsDatasource.prototype.mapQueryResponse = function (series, from, until) {
                    if (!series.length || !series[0].elements.length) {
                        return { data: [] };
                    }
                    var values = series[0].elements[0].series;
                    var sampleSize = (until - from) / (values.length);
                    var response = {
                        data: [{
                                target: series[0].elements[0].metric,
                                datapoints: values.map(function (value, index) {
                                    return [value, (from + index * sampleSize) * 1e3];
                                })
                            }]
                    };
                    return response;
                };
                /**
                 * Filters the metrics that matches the query string.
                 *
                 * @param  {Array} metrics
                 * @param  {string} query
                 * @return {Array}
                 */
                VividCortexMetricsDatasource.prototype.filterMetrics = function (metrics, query) {
                    return metrics.filter(function (metric) { return metric.text.indexOf(query) > -1; });
                };
                return VividCortexMetricsDatasource;
            })();
            exports_1("default", VividCortexMetricsDatasource);
        }
    }
});
//# sourceMappingURL=datasource.js.map