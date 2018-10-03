///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />

import { QueryCtrl } from 'app/plugins/sdk';
import './css/query_editor.css!';

export class VividCortexQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  public loading;

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
    const defer = this.$q.defer();

    this.loading = true;

    if (this.metricFindTimeout) {
      this.$timeout.cancel(this.metricFindTimeout);
    }

    this.metricFindTimeout = this.$timeout(() => {
      this.datasource
        .metricFindQuery(query)
        .then(metrics => {
          defer.resolve(metrics);
        })
        .catch(error => defer.reject(error))
        .finally(() => {
          this.metricFindTimeout = null;
          this.loading = false;
        });
    }, 250);

    return defer.promise;
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}
