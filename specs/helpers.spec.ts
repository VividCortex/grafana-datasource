import { expect } from 'chai';
import 'mocha';
import { calculateSampleSize } from '../src/lib/helpers';

describe('Sample size helper', () => {
  it('should calculate the sample size as expected', () => {
    expect(calculateSampleSize(1526496388, 1526499988, 899)).to.equal(4);
    expect(calculateSampleSize(1526496719, 1526500319, 1230)).to.equal(2);
  });

  it('should default to 1 when the interval is too small', () => {
    expect(calculateSampleSize(1526496719, 1526496720, 1230)).to.equal(1);
    expect(calculateSampleSize(1526496719, 1526496720, 30)).to.equal(1);
  });
});
