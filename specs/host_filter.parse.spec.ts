import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { parseFilters, testHost } from '../src/lib/host_filter';

const parseSpy = sinon.spy(parseFilters);

describe('Filter parser', () => {
  it('should not fail with empty configuration', () => {
    const result = parseFilters('');

    expect(result).to.be.an('array');

    expect(parseSpy.threw()).to.be.false;
    expect(result).to.deep.equal([
      {
        type: 'substring',
        value: '',
      },
    ]);
  });

  describe('Key=value filters', () => {
    it('should parse a key=value filter', () => {
      const result = parseFilters('type=os');

      expect(result).to.deep.equal([
        {
          type: 'attribute',
          key: 'type',
          value: 'os',
        },
      ]);
    });

    it('should parse any key=value filter', () => {
      const result = parseFilters('id=1337');

      expect(result).to.deep.equal([
        {
          type: 'attribute',
          key: 'id',
          value: '1337',
        },
      ]);
    });

    it('should parse many key=value filters', () => {
      const result = parseFilters('type=os type=redis');

      expect(result).to.deep.equal([
        {
          type: 'attribute',
          key: 'type',
          value: 'os',
        },
        {
          type: 'attribute',
          key: 'type',
          value: 'redis',
        },
      ]);
    });
  });

  describe('Exact filters', () => {
    it('should parse an exact filter', () => {
      const result = parseFilters('"ip-192-168-133-7"');

      expect(result).to.deep.equal([
        {
          type: 'exact',
          value: 'ip-192-168-133-7',
        },
      ]);
    });

    it('should parse many exact filters', () => {
      const result = parseFilters('"ip-192-168-133-7" "redis2"');

      expect(result).to.deep.equal([
        {
          type: 'exact',
          value: 'ip-192-168-133-7',
        },
        {
          type: 'exact',
          value: 'redis2',
        },
      ]);
    });
  });

  describe('Exclude filters', () => {
    it('should parse an exact filter', () => {
      const result = parseFilters('-"ip-192-168-133-7"');

      expect(result).to.deep.equal([
        {
          type: 'exclude',
          value: 'ip-192-168-133-7',
        },
      ]);
    });

    it('should parse many exclude filters', () => {
      const result = parseFilters('-"ip-192-168-133-7" -"redis2"');

      expect(result).to.deep.equal([
        {
          type: 'exclude',
          value: 'ip-192-168-133-7',
        },
        {
          type: 'exclude',
          value: 'redis2',
        },
      ]);
    });
  });

  describe('Substring filters', () => {
    it('should parse an exact filter', () => {
      const result = parseFilters('ip-192-168');

      expect(result).to.deep.equal([
        {
          type: 'substring',
          value: 'ip-192-168',
        },
      ]);
    });

    it('should parse many key=value filters', () => {
      const result = parseFilters('ip-192-168- red');

      expect(result).to.deep.equal([
        {
          type: 'substring',
          value: 'ip-192-168-',
        },
        {
          type: 'substring',
          value: 'red',
        },
      ]);
    });
  });

  describe('Mixed filters', () => {
    it('should parse mixed filters', () => {
      const result = parseFilters('type=os "ip-192-168-133-7" red');

      expect(result).to.have.lengthOf(3);

      expect(result).to.deep.equal([
        {
          type: 'attribute',
          key: 'type',
          value: 'os',
        },
        {
          type: 'exact',
          value: 'ip-192-168-133-7',
        },
        {
          type: 'substring',
          value: 'red',
        },
      ]);
    });
  });
});
