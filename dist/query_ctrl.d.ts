/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl: string;
  loading: any;
  private metricFindTimeout;
  private $q;
  private $timeout;
  /** @ngInject **/
  constructor($scope: any, $injector: any, $q: any, $timeout: any);
  getOptions(query: any): any;
  onChangeInternal(): void;
}
