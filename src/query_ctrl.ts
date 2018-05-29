///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

export class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);

    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'timeserie';

    this.datasource.refreshHostsForMetrics();
  }

  getOptions(query) {
    return this.datasource.metricFindQuery(query || '');
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }
}
