/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class VividCortexDatasource {
  private apiToken;
  private backendSrv;
  private templateSrv;
  private $q;
  /** @ngInject */
  constructor(instanceSettings: any, backendSrv: any, templateSrv: any, $q: any);
  testDatasource(): any;
  annotationQuery(): void;
  metricFindQuery(query: string): any;
  query(options: any): any;
  /**
   * Perform a query-series query for a given target (host and metric) in a time frame.
   *
   * @param  {object} target
   * @param  {number} from
   * @param  {number} until
   * @return {Promise}
   */
  doQuery(target: any, from: number, until: number): any;
  /**
   * Interpolate Grafana variables and strip scape characters.
   *
   * @param  {string} metric
   * @return {string}
   */
  interpolateVariables(metric?: string): any;
  /**
   * Perform an HTTP request.
   *
   * @param  {string} endpoint
   * @param  {string} method
   * @param  {Object} params
   * @param  {Object} body
   * @return {Promise}
   */
  doRequest(endpoint: any, method: any, params?: {}, body?: {}): any;
  /**
   * Take an array of hosts and apply the configured filters.
   *
   * @param  {Array}  hosts
   * @param  {string} config
   * @return {Array}
   */
  filterHosts(hosts: Array<any>, config: string): any[];
  /**
   * Prepare the metric to be properly interpreted by the API. E.g. if Grafana is using template
   * variables and requesting multiple metrics.
   *
   * @param  {string} metric
   * @return {string}
   */
  transformMetricForQuery(metric?: string): string;
  /**
   * Map a VividCortex series response to Grafana's structure.
   *
   * @param  {Array} series
   * @param  {number} from
   * @param  {number} until
   * @return {Array}
   */
  mapQueryResponse(
    series: Array<any>,
    from: number,
    until: number
  ): {
    data: any[];
  };
}
