/**
 * Transform a string of defined rules to an array of objects describing the filter purpose.
 *
 * @param  {string} config
 * @return {Array}
 */
declare function parseFilters(config?: string): ({
    type: string;
    key: string;
    value: string;
} | {
    type: string;
    value: string;
})[];
/**
 * Apply an array of filter rules to a host. True means the host passes the filters.
 *
 * @param  {object} host
 * @param  {Array} filters
 * @return {boolean}
 */
declare function testHost(host: any, filters: any[]): boolean;
export { parseFilters, testHost };
