import { expect } from 'chai';
import 'mocha';
import VividCortexDatasource from '../src/datasource';
import { backendSrv, templateSrv, $q } from './lib/mocks';

const datasource = new VividCortexDatasource({ jsonData: { apiToken: 1234 } }, backendSrv, templateSrv, $q);

describe('VividCortex datasource', () => {
  it('should be instantiable', () => {
    expect(datasource).not.to.be.undefined;
  });
});
