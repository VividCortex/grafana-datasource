///<reference path='../node_modules/grafana-sdk-mocks/app/headers/common.d.ts' />
import * as moment from 'moment';
import { parseFilters, testHost } from './lib/host_filter';
import { calculateSampleSize } from './lib/helpers';

const momentjs = moment.default ? moment.default : moment;

export default class VividCortexDatasource {
  private apiToken: string;
  private backendSrv;
  private templateSrv;
  private $q;

  /** @ngInject */
  constructor(instanceSettings, backendSrv, templateSrv, $q) {
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.$q = $q;

    this.apiToken = instanceSettings.jsonData.apiToken;
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

  annotationQuery() {
    throw new Error('Annotation support not implemented yet.');
  }

  metricFindQuery(query: string) {
    const params = {
      from: momentjs()
        .utc()
        .subtract(7, 'days')
        .unix(),
      until: momentjs()
        .utc()
        .unix(),
      new: '0',
      filter: query ? `*${query}*` : undefined,
    };

    return this.doRequest('metrics', 'GET', params)
      .then(response => response.data.data || [])
      .then(metrics => metrics.map(metric => ({ text: metric.name, value: metric.name })))
      .then(metrics => metrics.sort((a, b) => (a.text === b.text ? 0 : a.text > b.text ? 1 : -1)));
  }

  query(options) {
    if (options.targets.length === 0) {
      return this.$q.when({ data: [] });
    }

    const promises = options.targets.map(target => {
      options.range.from.utc();
      options.range.to.utc();

      return this.doQuery(target, options.range.from.unix(), options.range.to.unix(), options.maxDataPoints);
    });

    return this.$q.all(promises).then(function(responses) {
      const result = responses.reduce((result, response) => result.concat(response.data), []);

      return { data: result };
    });
  }

  /* Custom methods ----------------------------------------------------------------------------- */

  /**
   * Get the active hosts in a time interval.
   *
   * @param  {number} from:
   * @param  {number} until
   * @return {Promise}
   */
  getActiveHosts(from: number, until: number) {
    return this.doRequest('hosts', 'GET', {
      from: from,
      until: until,
    }).then(response => {
      return response.data.data;
    });
  }

  /**
   * Perform a query-series query for a given target (host and metric) in a time frame.
   *
   * @param  {object} target
   * @param  {number} from
   * @param  {number} until
   * @param  {number} dataPoints
   * @return {Promise}
   */
  doQuery(target: any, from: number, until: number, dataPoints: number) {
    const params = {
      from: from,
      samplesize: calculateSampleSize(from, until, dataPoints),
      until: until,
      host: null,
      separateHosts: target.separateHosts ? 1 : 0,
    };

    const body = {
      metrics: this.transformMetricForQuery(this.interpolateVariables(target.target)),
    };

    const defer = this.$q.defer();

    this.getActiveHosts(params.from, params.until).then(hosts => {
      const filteredHosts = this.filterHosts(hosts, target.hosts);

      params.host = filteredHosts.map(host => host.id).join(',');

      this.doRequest('metrics/query-series', 'POST', params, body)
        .then(response => ({
          metrics: response.data.data || [],
          from: parseInt(response.headers('X-Vc-Meta-From')),
          until: parseInt(response.headers('X-Vc-Meta-Until')),
        }))
        .then(response => {
          defer.resolve(this.mapQueryResponse(response.metrics, filteredHosts, response.from, response.until));
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
  interpolateVariables(metric: string = '') {
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
   * @param  {string} config
   * @return {Array}
   */
  filterHosts(hosts: Array<any>, config: string) {
    const filters = parseFilters(config);

    return hosts.filter(host => testHost(host, filters));
  }

  /**
   * Prepare the metric to be properly interpreted by the API. E.g. if Grafana is using template
   * variables and requesting multiple metrics.
   *
   * @param  {string} metric
   * @return {string}
   */
  transformMetricForQuery(metric: string = '') {
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
   * @param  {Array} hosts
   * @param  {number} from
   * @param  {number} until
   * @return {Array}
   */
  mapQueryResponse(series: Array<any>, hosts: Array<any>, from: number, until: number) {
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
          target: this.getTargetNameFromSeries(element, hosts),
          datapoints: values.map((value, index) => {
            return [value, (from + index * sampleSize) * 1e3];
          }),
        });
      });
    });

    return response;
  }

  /**
   * From a time series response, return the appropiate label to identify the target in the graph.
   * When the response is divided by host, we use the host name, otherwise the metric name.
   *
   * @param  {Object} series description
   * @param  {Array} series description
   * @return {string}        description
   */
  getTargetNameFromSeries(series, hosts: Array<any>) {
    if (!series.host) {
      return series.metric;
    }

    const host = hosts.filter(host => host.id === series.host);

    return host.length ? host[0].name : 'Unknown host';
  }
}
