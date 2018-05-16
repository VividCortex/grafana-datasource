System.register([], function(exports_1) {
  /**
   * Based on the time interval and the number of expected points, calculate the sample size parameter.
   *
   * @param  {number} until
   * @param  {number} from
   * @param  {number} dataPoints
   * @return {number}
   */
  function calculateSampleSize(from, until, dataPoints) {
    return Math.max(Math.floor((until - from) / dataPoints), 1);
  }
  exports_1('calculateSampleSize', calculateSampleSize);
  return {
    setters: [],
    execute: function() {},
  };
});
//# sourceMappingURL=helpers.js.map
