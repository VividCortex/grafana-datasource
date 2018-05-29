///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { QueryCtrl } from 'app/plugins/sdk';
import _ from 'lodash';
import './css/query_editor.css!';

export class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  private debouncedMetricFind;

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);

    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'timeserie';

    this.datasource.refreshHostsForMetrics();

    this.debouncedMetricFind = _.debounce(this.datasource.metricFindQuery.bind(this.datasource), 250);
  }

  getOptions(query) {
    return this.debouncedMetricFind(query);
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}
