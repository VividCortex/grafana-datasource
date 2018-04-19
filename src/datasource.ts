///<reference path='../node_modules/grafana-sdk-mocks/app/headers/common.d.ts' />
import { parseFilters, testHost } from './lib/filters';

export default class VividCortexMetricsDatasource {
  apiToken: string;
  $q;

  /** @ngInject */
  constructor(instanceSettings, private backendSrv, private templateSrv, $q) {
    this.apiToken = instanceSettings.jsonData.apiToken;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.$q = $q;
  }

  testDatasource() {
    const success = {
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
      response => {
        if (response.status === 200) {
          return success;
        }
        return error;
      },
      () => {
        return error;
      }
    );
  }

  annotationQuery(options) {
    throw new Error('Annotation support not implemented yet.');
  }

  metricFindQuery(query: string) {
    const params = {
      q: this.interpolateVariables(query),
    };

    return this.doRequest('metrics/search', 'GET', params)
      .then(response => response.data.data || [])
      .then(metrics => metrics.map(metric => ({ text: metric, value: metric })));
  }

  query(options) {
    if (options.targets.length === 0) {
      return this.$q.when({ data: [] });
    }

    const promises = options.targets.map(target => {
      return this.doQuery(target, options.range.from.unix(), options.range.to.unix());
    });

    return this.$q.all(promises).then(function(responses) {
      const result = responses.reduce((result, response) => result.concat(response.data), []);

      return { data: result };
    });
  }

  /* Custom methods ----------------------------------------------------------------------------- */

  /**
   * Perform a query-series query for a given target (host and metric) in a time frame.
   *
   * @param  {object} target
   * @param  {number} from
   * @param  {number} until
   * @return {Promise}
   */
  doQuery(target: any, from: number, until: number) {
    const params = {
      from: from,
      samplesize: 12,
      until: until,
      host: null,
    };

    const body = {
      metrics: this.transformMetricForQuery(this.interpolateVariables(target.target)),
    };

    const defer = this.$q.defer();

    this.doRequest('hosts', 'GET', {
      from: from,
      until: until,
    }).then(response => {
      params.host = this.filterHosts(response.data.data, target.hosts);

      this.doRequest('metrics/query-series', 'POST', params, body)
        .then(response => ({
          metrics: response.data.data || [],
          from: parseInt(response.headers('X-Vc-Meta-From')),
          until: parseInt(response.headers('X-Vc-Meta-Until')),
        }))
        .then(response => {
          defer.resolve(this.mapQueryResponse(response.metrics, response.from, response.until));
        })
        .catch(error => {
          defer.reject(error);
        });
    });

    return defer.promise;
  }

  /**
   * Interpolate Grafana variables and strip scape characters.
   *
   * @param  {string} metric
   * @return {string}
   */
  interpolateVariables(metric: string) {
    return this.templateSrv.replace(metric, null, 'regex').replace(/\\\./g, '.');
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
        Authorization: 'Bearer ' + this.apiToken,
      },
      params: params,
      url: 'https://app.vividcortex.com/api/v2/' + endpoint,
      method: method,
      data: body,
    };

    return this.backendSrv.datasourceRequest(options);
  }

  /**
   * Take an array of hosts and apply the configured filters.
   *
   * @param  {Array}  hosts
   * @param  {object} config
   * @return {Array}
   */
  filterHosts(hosts: Array<any>, config: any) {
    const filters = parseFilters(config);

    return hosts
      .filter(host => testHost(host, filters))
      .map(host => host.id)
      .join(',');
  }

  /**
   * Prepare the metric to be properly interpreted by the API. E.g. if Grafana is using template
   * variables and requesting multiple metrics.
   *
   * @param  {string} metric
   * @return {string}
   */
  transformMetricForQuery(metric: string) {
    const metrics = metric.replace(/[()]/g, '').split('|');

    if (metrics.length < 2) {
      return metric;
    }

    return metrics.join(',');
  }

  /**
   * Map a VividCortex series response to Grafana's structure.
   *
   * @param  {Array} series
   * @param  {number} from
   * @param  {number} until
   * @return {Array}
   */
  mapQueryResponse(series: Array<any>, from: number, until: number) {
    if (!series.length || !series[0].elements.length) {
      return { data: [] };
    }

    const response = {
      data: [],
    };

    series.forEach(serie => {
      serie.elements.forEach(element => {
        const values = element.series;
        const sampleSize = (until - from) / values.length;

        response.data.push({
          target: element.metric,
          datapoints: values.map((value, index) => {
            return [value, (from + index * sampleSize) * 1e3];
          }),
        });
      });
    });

    return response;
  }
}
