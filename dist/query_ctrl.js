///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['app/plugins/sdk', './css/query_editor.css!'], function(exports_1) {
  var __extends =
    (this && this.__extends) ||
    function(d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  var sdk_1;
  var VividCortexQueryCtrl;
  return {
    setters: [
      function(sdk_1_1) {
        sdk_1 = sdk_1_1;
      },
      function(_1) {},
    ],
    execute: function() {
      VividCortexQueryCtrl = (function(_super) {
        __extends(VividCortexQueryCtrl, _super);
        /** @ngInject **/
        function VividCortexQueryCtrl($scope, $injector, $q, $timeout) {
          this.$q = $q;
          this.$timeout = $timeout;
          _super.call(this, $scope, $injector);
          this.target.target = this.target.target || 'select metric';
          this.target.type = this.target.type || 'timeseries';
        }
        VividCortexQueryCtrl.prototype.getOptions = function(query) {
          var _this = this;
          if (!this.metricFindDefer) {
            this.metricFindDefer = this.$q.defer();
          }
          this.loading = true;
          this.$timeout.cancel(this.metricFindTimeout);
          this.metricFindTimeout = this.$timeout(function() {
            _this.datasource
              .metricFindQuery(query)
              .then(function(metrics) {
                _this.loading = false;
                _this.metricFindDefer.resolve(metrics);
              })
              .catch(function(error) {
                return _this.metricFindDefer.reject(error);
              })
              .finally(function() {
                return (_this.metricFindDefer = null);
              });
          }, 250);
          return this.metricFindDefer.promise;
        };
        VividCortexQueryCtrl.prototype.onChangeInternal = function() {
          this.panelCtrl.refresh();
        };
        VividCortexQueryCtrl.templateUrl = 'partials/query.editor.html';
        return VividCortexQueryCtrl;
      })(sdk_1.QueryCtrl);
      exports_1('VividCortexQueryCtrl', VividCortexQueryCtrl);
    },
  };
});
//# sourceMappingURL=query_ctrl.js.map
