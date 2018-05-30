///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

export class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  public loading;

  private metricFindDefer;
  private metricFindTimeout;
  private $q;

  /** @ngInject **/
  constructor($scope, $injector, $q) {
    this.$q = $q;

    super($scope, $injector);

    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'timeseries';
  }

  getOptions(query) {
    if (!this.metricFindDefer) {
      this.metricFindDefer = this.$q.defer();
    }

    this.loading = true;

    clearTimeout(this.metricFindTimeout);

    this.metricFindTimeout = setTimeout(() => {
      this.datasource
        .metricFindQuery(query)
        .then(metrics => {
          this.loading = false;
          this.metricFindDefer.resolve(metrics);
        })
        .catch(error => this.metricFindDefer.reject(error))
        .finally(() => (this.metricFindDefer = null));
    }, 250);

    return this.metricFindDefer.promise;
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}
