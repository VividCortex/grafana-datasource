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
        function VividCortexQueryCtrl($scope, $injector) {
          _super.call(this, $scope, $injector);
          this.defaults = {};
          this.target.target = this.target.target || 'select metric';
          this.target.type = this.target.type || 'timeserie';
        }
        VividCortexQueryCtrl.prototype.getOptions = function(query) {
          return this.datasource.metricFindQuery(query || '');
        };
        VividCortexQueryCtrl.prototype.onChangeInternal = function() {
          this.panelCtrl.refresh(); // Asks the panel to refresh data.
        };
        VividCortexQueryCtrl.templateUrl = 'partials/query.editor.html';
        return VividCortexQueryCtrl;
      })(sdk_1.QueryCtrl);
      exports_1('VividCortexQueryCtrl', VividCortexQueryCtrl);
    },
  };
});
//# sourceMappingURL=query_ctrl.js.map
