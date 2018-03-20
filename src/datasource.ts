///<reference path='../node_modules/grafana-sdk-mocks/app/headers/common.d.ts' />

import _ from 'lodash';

export default class VividCortexMetricsDatasource {
  org: string;
  apiToken: string;

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
      .then(response => {
        console.warn(response);

        return [];
      })
  }

  annotationQuery(options) {
    throw new Error('Annotation Support not implemented yet.');
  }

  metricFindQuery(query: string) {
    return this.doRequest('metrics', 'GET')
      .then(response => response.data.data || [])
      .then(metrics => metrics.map(metric => ({ text: metric.name, value: metric.name })))
      .then(metrics => metrics.filter(metric => metric.text.indexOf(query) > -1));
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
}
