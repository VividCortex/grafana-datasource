import { expect } from 'chai';
import 'mocha';
import $q from 'q';
import VividCortexDatasource from '../src/datasource';
import { backendSrv, templateSrv } from './lib/mocks';

const datasource = new VividCortexDatasource({ jsonData: { apiToken: 1234 } }, backendSrv, templateSrv, $q);

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
});
