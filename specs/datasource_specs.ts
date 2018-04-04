import { describe, beforeEach, it, sinon, expect, angularMocks } from './lib/common';
import VividCortexMetricsDatasource from '../src/datasource';
import TemplateSrvStub from './lib/template_srv_stub';
import Q from 'q';
import moment from 'moment';

describe('VividCortexMetricsDatasource', function() {
  let ctx: any = {
    backendSrv: {},
    templateSrv: new TemplateSrvStub(),
  };

  beforeEach(function() {
    ctx.$q = Q;
    ctx.instanceSettings = {};

    ctx.ds = new VividCortexMetricsDatasource(ctx.instanceSettings, ctx.backendSrv, ctx.templateSrv, ctx.$q);
  });

  describe('When performing testDatasource', function() {});

  describe('When performing query', function() {});
});
