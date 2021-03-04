/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class VividCortexDatasource {
    private apiToken;
    private apiUrl;
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
     * Get the active hosts in a time interval.
     *
     * @param  {number} from:
     * @param  {number} until
     * @return {Promise}
     */
    getActiveHosts(from: number, until: number): any;
    /**
     * Perform a query-series query for a given target (host and metric) in a time frame.
     *
     * @param  {object} target
     * @param  {number} from
     * @param  {number} until
     * @param  {number} dataPoints
     * @return {Promise}
     */
    doQuery(target: any, from: number, until: number, dataPoints: number): any;
    /**
     * Interpolate Grafana variables and strip scape characters.
     */
    interpolateVariables(metric?: string): string;
    /**
     * Perform an HTTP request.
     *
     * @param  {string} endpoint
     * @param  {string} method
     * @param  {Object} params
     * @param  {Object} body
     * @return {Promise}
     */
    doRequest(endpoint: any, method: any, params?: {}, body?: any): any;
    readResponseHeaders(headers: any, attribute: string): any;
    /**
     * Prepare the metric to be properly interpreted by the API. E.g. if Grafana is using template
     * variables and requesting multiple metrics.
     */
    transformMetricForQuery(metric?: string): string;
    /**
     * Map a DPM series response to Grafana's structure.
     *
     * @param  {Array} series
     * @param  {Array} hosts
     * @param  {number} from
     * @param  {number} until
     * @return {Array}
     */
    mapQueryResponse(series: any[], hosts: any[], from: number, until: number): {
        data: any[];
    };
    /**
     * From a time series response, return the appropiate label to identify the target in the graph.
     * When the response is divided by host, we use the host name, otherwise the metric name.
     *
     * @param  {Object} series description
     * @param  {Array} series description
     * @return {string}        description
     */
    getTargetNameFromSeries(series: any, hosts: any[]): any;
}
