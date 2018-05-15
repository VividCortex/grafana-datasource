/// <reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export declare class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl: string;
  defaults: {};
  /** @ngInject **/
  constructor($scope: any, $injector: any);
  getOptions(query: any): any;
  onChangeInternal(): void;
}
