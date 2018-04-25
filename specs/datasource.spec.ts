import { expect } from 'chai';
import 'mocha';
import $q from 'q';
import * as sinon from 'sinon';
import VividCortexDatasource from '../src/datasource';
import { backendSrv, templateSrv } from './lib/mocks';

const config = require('../src/config.json');

const datasource = new VividCortexDatasource({ jsonData: { apiToken: 'success' } }, backendSrv, templateSrv, $q);

const errorDatasource = new VividCortexDatasource({ jsonData: { apiToken: 'error' } }, backendSrv, templateSrv, $q);

const datasourceRequestSpy = sinon.spy(backendSrv, 'datasourceRequest');

describe('VividCortex datasource', () => {
  it('should be instantiable', () => {
    expect(datasource).not.to.be.undefined;
  });

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

  it('should let the user know the datasource configuration failed', done => {
    errorDatasource.testDatasource().then(response => {
      expect(response).to.deep.equal({
        status: 'error',
        message:
          'The configuration test was not successful. Pleaes check your API token and Internet access and try again.',
        title: 'Credentials error',
      });

      done();
    });
  });

  it('should search for metric names', done => {
    datasource.metricFindQuery('host.').then(response => {
      expect(response.length).to.equal(11);
      expect(response[10]).to.deep.equal({
        text: 'host.verbs',
        value: 'host.verbs',
      });

      expect(datasourceRequestSpy.lastCall.args[0].method).to.equal('GET');
      expect(datasourceRequestSpy.lastCall.args[0].url).to.equal(config.apiUrl + 'metrics/search');
      expect(datasourceRequestSpy.lastCall.args[0].data).to.deep.equal({});
      expect(datasourceRequestSpy.lastCall.args[0].params).to.deep.equal({ q: 'host.' });

      done();
    });
  });
});
