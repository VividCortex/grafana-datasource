/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
export default class VividCortexMetricsDatasource {
    private backendSrv;
    private templateSrv;
    private $q;
    org: string;
    apiToken: string;
    metrics: Array<any>;
    /** @ngInject */
    constructor(instanceSettings: any, backendSrv: any, templateSrv: any, $q: any);
    query(options: any): any;
    annotationQuery(options: any): void;
    metricFindQuery(query: string): any;
    testDatasource(): any;
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
     * Takes a Grafana query object and returns an object with the required information to query
     * VividCortex, or null if there is an error or no selected metrics.
     *
     * @param  {Object} options Grafana options object
     * @return {Object|null}
     */
    getQueryParameters(options: any): {
        metric: any;
        hosts: string;
        params: {
            from: any;
            until: any;
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
    mapQueryResponse(series: Array<any>, from: number, until: number): {
        data: {
            target: any;
            datapoints: any;
        }[];
    };
    /**
     * Filters the metrics that matches the query string.
     *
     * @param  {Array} metrics
     * @param  {string} query
     * @return {Array}
     */
    filterMetrics(metrics: Array<any>, query: string): any[];
}
