import VividCortexMetricsDatasource from './datasource';
import {VividCortexMetricsQueryCtrl} from './query_ctrl';
import {VividCortexMetricsConfigCtrl} from './config_ctrl';

class VividCortexMetricsAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  VividCortexMetricsDatasource as Datasource,
  VividCortexMetricsQueryCtrl as QueryCtrl,
  VividCortexMetricsConfigCtrl as ConfigCtrl,
  VividCortexMetricsAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
