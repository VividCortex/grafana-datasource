import { expect } from 'chai';
import 'mocha';
import * as $q from 'q';
import * as sinon from 'sinon';
import VividCortexDatasource from '../src/datasource';
import { backendSrv, templateSrv } from './lib/mocks';

const config = require('../src/config.json');

const datasourceRequestSpy = sinon.spy(backendSrv, 'datasourceRequest');
const replaceSpy = sinon.spy(templateSrv, 'replace');

let datasource, failureDatasource, errorDatasource;

describe('VividCortex datasource', () => {
  beforeEach(() => {
    datasource = new VividCortexDatasource({ jsonData: { apiToken: 'success' } }, backendSrv, templateSrv, $q);
    failureDatasource = new VividCortexDatasource({ jsonData: { apiToken: 'failure' } }, backendSrv, templateSrv, $q);
    errorDatasource = new VividCortexDatasource({ jsonData: { apiToken: 'error' } }, backendSrv, templateSrv, $q);
  });

  it('should be instantiable', () => {
    expect(datasource).not.to.be.undefined;
  });

  describe('#testDatasource()', () => {
    it('should allow the user to test the datasource', done => {
      datasource.testDatasource().then(response => {
        expect(response).to.deep.equal({
          status: 'success',
          message: 'Your VividCortex datasource was successfully configured.',
          title: 'Success',
        });

        expect(datasourceRequestSpy.lastCall.args[0].method).to.equal('GET');
        expect(datasourceRequestSpy.lastCall.args[0].url).to.equal(config.apiUrl + 'metrics');
        expect(datasourceRequestSpy.lastCall.args[0].data).to.deep.equal({});

        done();
      });
    });

    it('should let the user know there was an error with the datasource verification', done => {
      failureDatasource.testDatasource().then(response => {
        expect(response).to.deep.equal({
          status: 'error',
          message:
            'The configuration test was not successful. Pleaes check your API token and Internet access and try again.',
          title: 'Credentials error',
        });

        done();
      });
    });

    it('should let the user know the datasource configuration failed', done => {
      errorDatasource.testDatasource().then(error => {
        expect(error).to.deep.equal({
          status: 'error',
          message:
            'The configuration test was not successful. Pleaes check your API token and Internet access and try again.',
          title: 'Credentials error',
        });

        done();
      });
    });
  });

  describe('#annotationQuery()', () => {
    it('Should not be implemented', () => {
      expect(datasource.annotationQuery).to.throw();
    });
  });

  describe('#metricFindQuery()', () => {
    it('should search for metric names', done => {
      datasource.metricFindQuery('host.').then(response => {
        expect(response).to.have.lengthOf(11);
        expect(response[10]).to.deep.equal({
          text: 'host.verbs',
          value: 'host.verbs',
        });

        expect(datasourceRequestSpy.lastCall.args[0].method).to.equal('GET');
        expect(datasourceRequestSpy.lastCall.args[0].url).to.equal(config.apiUrl + 'metrics');
        expect(datasourceRequestSpy.lastCall.args[0].data).to.deep.equal({});
        expect(datasourceRequestSpy.lastCall.args[0].params['new']).to.equal('0');
        expect(datasourceRequestSpy.lastCall.args[0].params['filter']).to.equal('*host.*');

        done();
      });
    });

    it('should not filter and get all the metrics by default', done => {
      datasource.metricFindQuery('').then(response => {
        expect(response).to.have.lengthOf(11);
        expect(datasourceRequestSpy.lastCall.args[0].params['filter']).to.equal(undefined);

        done();
      });
    });
  });

  describe('#query()', () => {
    it('should not attempt to hit the API with no targets', done => {
      datasource.query({ targets: [] }).then(response => {
        expect(response.data).to.have.lengthOf(0);

        done();
      });
    });

    it('should perform as many API requests as configured targets', done => {
      const doQuerySpy = sinon.spy(datasource, 'doQuery'),
        doRequestSpy = sinon.spy(datasource, 'doRequest');

      const options = {
        targets: [
          { target: 'host.queries.*.*.tput', hosts: 'type=mysql', separateHosts: 1 },
          { target: 'host.queries.*.*.t_us', hosts: 'type=mysql', separateHosts: 0 },
        ],
        range: {
          from: { unix: () => 123456789, utc: sinon.spy() },
          to: { unix: () => 987654321, utc: sinon.spy() },
        },
      };

      datasource.query(options).then(response => {
        expect(options.range.from.utc.called).to.be.true;
        expect(options.range.to.utc.called).to.be.true;

        expect(doQuerySpy.callCount).to.equal(2);

        expect(doRequestSpy.callCount).to.equal(4);

        expect(response.data).to.have.lengthOf(2);

        done();
      });
    });
  });

  describe('#getActiveHosts', () => {
    it('should retrieve the active hosts in a time interval', done => {
      datasource.getActiveHosts(123456789, 987654321).then(response => {
        expect(response).to.have.lengthOf(1);

        done();
      });
    });
  });

  describe('#interpolateVariables()', () => {
    it('should call the interpolate service and strip scape characters', () => {
      const metric = 'host.queries.q.abcd12345.t_us';

      expect(datasource.interpolateVariables(metric)).to.equal('host.queries.q.abcd12345.t_us');

      expect(replaceSpy.lastCall.args[0]).to.equal(metric);
    });

    it('should not fail when given an undefined metric', () => {
      const metric = undefined;

      expect(datasource.interpolateVariables(metric)).to.equal('');
    });
  });

  describe('#doRequest()', () => {
    const params = {
      from: 123456789,
      samplesize: 12,
      until: 987654321,
      host: '1,2,3',
    };

    const body = {
      metrics: 'host.queries.q.c0ff33.tput',
    };

    beforeEach(() => {
      datasource.doRequest('metrics/query-series', 'POST', params, body);
    });

    it('should call the backend service with the correct parameters', () => {
      expect(datasourceRequestSpy.lastCall.args[0].headers['Content-Type']).to.equal('application/json');
      expect(datasourceRequestSpy.lastCall.args[0].headers.Authorization).to.equal('Bearer success');
      expect(datasourceRequestSpy.lastCall.args[0].params).to.deep.equal(params);
      expect(datasourceRequestSpy.lastCall.args[0].data).to.deep.equal(body);
    });
  });

  describe('#filterHosts()', () => {
    const hosts = [{ id: 1, name: 'testing-host-1', type: 'mysql' }, { id: 2, name: 'testing-host-2', type: 'mongo' }];

    it('should filter a set of hosts based in a user provided configuration string', () => {
      const filteredHosts = datasource.filterHosts(hosts, 'type=mongo');

      expect(filteredHosts).to.have.lengthOf(1);
      expect(filteredHosts[0].id).to.equal(2);
    });

    it('should interpolate variables in the host filter', () => {
      const filteredHosts = datasource.filterHosts(hosts, '$testing-host-1');

      expect(filteredHosts).to.have.lengthOf(1);
      expect(filteredHosts[0].id).to.equal(1);
    });
  });

  describe('#transformMetricForQuery()', () => {
    it('should return the same metric if no transform is required', () => {
      expect(datasource.transformMetricForQuery('host.queries.q.c0f33.tput')).to.equal('host.queries.q.c0f33.tput');
    });

    it('should transform multiple metrics to the VC format', () => {
      const input = '(host.queries.q.c0f33.tput|host.queries.q.c0f33.tput)';
      const expectedOutput = 'host.queries.q.c0f33.tput,host.queries.q.c0f33.tput';

      expect(datasource.transformMetricForQuery(input)).to.equal(expectedOutput);
    });

    it('should not fail when given an undefined metric', () => {
      expect(datasource.transformMetricForQuery(undefined)).to.equal('');
    });
  });

  describe('#mapQueryResponse()', () => {
    it('should return an empty array if no data was provided', () => {
      expect(datasource.mapQueryResponse([], [], 123456789, 987654321)).to.deep.equal({ data: [] });
      expect(datasource.mapQueryResponse([{ elements: [] }], [], 123456789, 987654321)).to.deep.equal({ data: [] });
    });

    it('should return an array with the expected format', () => {
      const input = [
        {
          elements: [
            {
              metric: 'host.queries.q.c0f33b4c0n.tput',
              series: [0, 1, 0],
            },
          ],
        },
        {
          elements: [
            {
              metric: 'host.queries.q.b33fav0c4d0.tput',
              series: [0, 0, 1],
            },
          ],
        },
      ];

      const expectedOutput = {
        data: [
          {
            target: 'host.queries.q.c0f33b4c0n.tput',
            datapoints: [[0, 123456789000], [1, 411522633000], [0, 699588477000]],
          },
          {
            target: 'host.queries.q.b33fav0c4d0.tput',
            datapoints: [[0, 123456789000], [0, 411522633000], [1, 699588477000]],
          },
        ],
      };

      expect(datasource.mapQueryResponse(input, [], 123456789, 987654321)).to.deep.equal(expectedOutput);
    });

    it('should use the host name as the metric when separating by host', () => {
      const hosts = [
        {
          id: 1,
          name: 'Host 1',
        },
        {
          id: 2,
          name: 'Host 2',
        },
      ];

      const input = [
        {
          elements: [
            {
              metric: 'host.queries.q.c0f33b4c0n.tput',
              host: 1,
              series: [0, 1, 0],
            },
          ],
        },
        {
          elements: [
            {
              host: 2,
              metric: 'host.queries.q.b33fav0c4d0.tput',
              series: [0, 0, 1],
            },
          ],
        },
      ];

      const expectedOutput = {
        data: [
          {
            target: 'Host 1',
            datapoints: [[0, 123456789000], [1, 411522633000], [0, 699588477000]],
          },
          {
            target: 'Host 2',
            datapoints: [[0, 123456789000], [0, 411522633000], [1, 699588477000]],
          },
        ],
      };

      expect(datasource.mapQueryResponse(input, hosts, 123456789, 987654321)).to.deep.equal(expectedOutput);
    });
  });

  describe('#getTargetNameFromSeries()', () => {
    it('should return the metric name if a host is not in the answer', () => {
      const series = { metric: 'os.cpu.loadavg' };

      expect(datasource.getTargetNameFromSeries(series, [])).to.equal('os.cpu.loadavg');
    });

    it('should return the host name if a host id is in the answer', () => {
      const series = { metric: 'os.cpu.loadavg', host: 1 };
      const hosts = [{ id: 0, name: 'Not me' }, { id: 1, name: 'Host 1' }, { id: 3, name: 'Me neither' }];

      expect(datasource.getTargetNameFromSeries(series, hosts)).to.equal('Host 1');
    });

    it('should not fail if the host was not found by id', () => {
      const series = { metric: 'os.cpu.loadavg', host: 4 };
      const hosts = [{ id: 0, name: 'Not me' }, { id: 1, name: 'Host 1' }, { id: 3, name: 'Me neither' }];

      expect(datasource.getTargetNameFromSeries(series, hosts)).to.equal('Unknown host');
    });
  });
});
