///<reference path="../node_modules/grafana-sdk-mocks/app/headers/common.d.ts" />
System.register(['lodash', 'app/plugins/sdk', './css/query_editor.css!'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var lodash_1, sdk_1;
    var VividCortexMetricsQueryCtrl;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            },
            function (_1) {}],
        execute: function() {
            VividCortexMetricsQueryCtrl = (function (_super) {
                __extends(VividCortexMetricsQueryCtrl, _super);
                /** @ngInject **/
                function VividCortexMetricsQueryCtrl($scope, $injector, templateSrv) {
                    _super.call(this, $scope, $injector);
                    this.templateSrv = templateSrv;
                    this.defaults = {};
                    lodash_1.default.defaultsDeep(this.target, this.defaults);
                    this.target.target = this.target.target || 'select metric';
                    this.target.type = this.target.type || 'timeserie';
                }
                VividCortexMetricsQueryCtrl.prototype.getOptions = function (query) {
                    return this.datasource.metricFindQuery(query || '');
                };
                VividCortexMetricsQueryCtrl.prototype.onChangeInternal = function () {
                    this.panelCtrl.refresh(); // Asks the panel to refresh data.
                };
                VividCortexMetricsQueryCtrl.templateUrl = 'partials/query.editor.html';
                return VividCortexMetricsQueryCtrl;
            })(sdk_1.QueryCtrl);
            exports_1("VividCortexMetricsQueryCtrl", VividCortexMetricsQueryCtrl);
        }
    }
});
//# sourceMappingURL=query_ctrl.js.map