///<reference path='../node_modules/grafana-sdk-mocks/app/headers/common.d.ts' />

import _ from 'lodash';

export default class VividCortexMetricsDatasource {
  org: string;
  apiToken: string;
  metrics: Array<any>;

  /** @ngInject */
  constructor(instanceSettings, private backendSrv, private templateSrv, private $q) {
    this.org = instanceSettings.jsonData.org;
    this.apiToken = instanceSettings.jsonData.apiToken;
  }

  query(options) {
    const parameters = this.getQueryParameters(options);

    if (! parameters) {
      return this.$q.when({data: []});
    }

    const params = {
      from: parameters.params.from,
      rank: 1,
      samplesize: 12,
      until: parameters.params.from,
      host: '0,211',
    };

    const body = {
      metrics: parameters.metric,
    };

    return this.doRequest('metrics/query-series', 'POST', params, body)
      .then(response => ({ metrics: response.data.data || [], from: parseInt(response.headers('X-Vc-Meta-From')), until: parseInt(response.headers('X-Vc-Meta-Until')) }))
      .then(response => {
        return this.mapQueryResponse(response.metrics, response.from, response.until);
      })
  }

  annotationQuery(options) {
    throw new Error('Annotation support not implemented yet.');
  }

  metricFindQuery(query: string) {
    if (this.metrics) {
      return this.filterMetrics(this.metrics, query);
    }

    return this.doRequest('metrics', 'GET')
      .then(response => response.data.data || [])
      .then(metrics => metrics.map(metric => ({ text: metric.name, value: metric.name })))
      .then(metrics => {
        this.metrics = metrics;

        return this.filterMetrics(metrics, query);
      });
  }

  testDatasource() {
    const success = {
      status: 'success',
      message: 'Your VividCortex datasource was successfully configured.',
      title: 'Success'
    }, error = {
      status: 'error',
      message: 'The API token or organization name are incorrect.',
      title: 'Credentials error'
    };

    return this.doRequest('metrics', 'GET', { limit: 1 })
      .then(response => {
        if (response.status === 200) {
          return success;
        }
        return error
      }, () => {
        return error;
      });
  }

  /**
   * Perform an HTTP request.
   *
   * @param  {string} endpoint
   * @param  {string} method
   * @param  {Object} params
   * @param  {Object} body
   * @return {Promise}
   */
  doRequest(endpoint, method, params = {}, body = {}) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.apiToken,
      },
      params: params,
      url: 'https://'+this.org+'.app.vividcortex.com/api/v2/'+endpoint,
      method: method,
      data: body,
    };

    return this.backendSrv.datasourceRequest(options);
  }

  /**
   * Takes a Grafana query object and returns an object with the required information to query
   * VividCortex, or null if there is an error or no selected metrics.
   *
   * @param  {Object} options Grafana options object
   * @return {Object|null}
   */
  getQueryParameters(options) {
    const metric = options.targets.reduce((metric, target) => {
      return target.target != 'select metric' ? target.target : metric;
    }, null);

    if (!metric) { return null; }

    return {
      metric: metric,
      params: {
        from: options.range.from.unix(),
        until: options.range.to.unix()
      }
    };
  }

  /**
   * Maps a VividCortex series response to Grafana's structure.
   *
   * @param  {Array} series
   * @param  {number} from
   * @param  {number} until
   * @return {Array}
   */
   mapQueryResponse(series: Array<any>, from: number, until: number) {
     if (! series.length || !series[0].elements.length) {
       return { data: [] };
     }

     const values = series[0].elements[0].series;
     const sampleSize = (until - from) / (values.length);

     const response = {
       data: [{
         target: series[0].elements[0].metric,
         datapoints: values.map((value, index) => {
             return [value, (from + index * sampleSize) * 1e3];
         })
       }]
     };

     console.warn(response);

     return response;
   }

  /**
   * Filters the metrics that matches the query string.
   *
   * @param  {Array} metrics
   * @param  {string} query
   * @return {Array}
   */
  filterMetrics(metrics: Array<any>, query: string) {
    return metrics.filter(metric => metric.text.indexOf(query) > -1)
  }
}
