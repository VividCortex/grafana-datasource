/**
 * Based on the time interval and the number of expected points, calculate the sample size parameter.
 *
 * @param  {number} until
 * @param  {number} from
 * @param  {number} dataPoints
 * @return {number}
 */
export function calculateSampleSize(from: number, until: number, dataPoints: number) {
  return Math.max(Math.floor((until - from) / dataPoints), 1);
}
