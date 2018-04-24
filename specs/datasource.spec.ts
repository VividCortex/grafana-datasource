import { expect } from 'chai';
import 'mocha';
import $q from 'q';
import VividCortexDatasource from '../src/datasource';
import { backendSrv, templateSrv } from './lib/mocks';

const datasource = new VividCortexDatasource({ jsonData: { apiToken: 'success' } }, backendSrv, templateSrv, $q);

const errorDatasource = new VividCortexDatasource({ jsonData: { apiToken: 'error' } }, backendSrv, templateSrv, $q);

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

      done();
    });
  });
});
