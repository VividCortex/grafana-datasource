import VividCortexDatasource from './datasource';
import { VividCortexQueryCtrl } from './query_ctrl';
import { VividCortexConfigCtrl } from './config_ctrl';

class VividCortexAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  VividCortexDatasource as Datasource,
  VividCortexQueryCtrl as QueryCtrl,
  VividCortexConfigCtrl as ConfigCtrl,
  VividCortexAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
