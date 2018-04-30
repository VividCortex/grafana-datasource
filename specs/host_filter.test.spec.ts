import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { parseFilters, testHost } from '../src/lib/host_filter';

const hosts = [
  { id: 1, name: 'testing-host-1', type: 'mysql' },
  { id: 2, name: 'testing-host-2', type: 'mongo' },
  { id: 3, name: 'testing-redis', type: 'redis' },
];

describe('Host filter', () => {
  it('should return all the hosts with an empty configuration', () => {
    const config = '',
      filters = parseFilters(config),
      result = hosts.filter(host => testHost(host, filters));

    expect(result).to.have.lengthOf(3);
  });

  describe('Key=value filters', () => {
    it('should filter the hosts by type', () => {
      const config = 'type=mysql',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal(1);
    });

    it('should filter the hosts by any attribute', () => {
      const config = 'name=testing-redis',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal(3);
    });

    it('should apply multiple attribute filters', () => {
      const config = 'type=mysql type=redis',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(2);
      expect(result[0].id).to.equal(1);
      expect(result[1].id).to.equal(3);
    });
  });

  describe('Exact filters', () => {
    it('should match exact names', () => {
      const config = 'testing-host-1',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal(1);
    });

    it('should match multiple exact names', () => {
      const config = '"testing-host-1" "testing-host-2"',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(2);
      expect(result[0].id).to.equal(1);
      expect(result[1].id).to.equal(2);
    });
  });

  describe('Substring filters', () => {
    it('should match partial strings', () => {
      const config = 'testing',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(3);
      expect(result[0].id).to.equal(1);
      expect(result[1].id).to.equal(2);
      expect(result[2].id).to.equal(3);
    });

    it('should do multiple substring matches', () => {
      const config = 'host redis',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(3);
      expect(result[0].id).to.equal(1);
      expect(result[1].id).to.equal(2);
      expect(result[2].id).to.equal(3);
    });
  });

  describe('Mixed filters', () => {
    it('should match mixed filters', () => {
      const config = 'type=mysql "testing-host-2" redis',
        filters = parseFilters(config),
        result = hosts.filter(host => testHost(host, filters));

      expect(result).to.have.lengthOf(3);
      expect(result[0].id).to.equal(1);
      expect(result[1].id).to.equal(2);
      expect(result[2].id).to.equal(3);
    });
  });
});
