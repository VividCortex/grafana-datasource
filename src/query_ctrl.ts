///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

export class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  public loading;

  private metricFindDefer;
  private metricFindTimeout;
  private $q;
  private $timeout;

  /** @ngInject **/
  constructor($scope, $injector, $q, $timeout) {
    this.$q = $q;
    this.$timeout = $timeout;

    super($scope, $injector);

    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'timeseries';
  }

  getOptions(query) {
    if (!this.metricFindDefer) {
      this.metricFindDefer = this.$q.defer();
    }

    this.loading = true;

    this.$timeout.cancel(this.metricFindTimeout);

    this.metricFindTimeout = this.$timeout(() => {
      this.datasource
        .metricFindQuery(query)
        .then(metrics => {
          this.metricFindDefer.resolve(metrics);
        })
        .catch(error => this.metricFindDefer.reject(error))
        .finally(() => {
          this.metricFindDefer = null;
          this.loading = false;
        });
    }, 250);

    return this.metricFindDefer.promise;
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}
