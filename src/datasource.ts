///<reference path='../node_modules/grafana-sdk-mocks/app/headers/common.d.ts' />

import _ from 'lodash';

export default class VividCortexMetricsDatasource {
  org: string;
  apiToken: string;

  /** @ngInject */
  constructor(instanceSettings, private backendSrv, private templateSrv, private $q) {
    this.org = instanceSettings.jsonData.org;
    this.apiToken = instanceSettings.jsonData.apiToken;
  }

  query(options) {
    console.warn(options);

    return this.$q.when({data: []});
  }

  annotationQuery(options) {
    throw new Error('Annotation Support not implemented yet.');
  }

  metricFindQuery(query: string) {
    console.warn(query);

    return this.$q.when({data: ["upper_25","upper_50","upper_75","upper_90","upper_95"]});
  }

  testDatasource() {
    if (this.org === 'vividcortex' && this.apiToken === 'abc123') {
      return this.$q.when({
        status: 'success',
        message: 'Your VividCortex datasource was successfully configured.',
        title: 'Success'
      });
    }

    return this.$q.when({
      status: 'error',
      message: 'The API token or organization name are incorrect.',
      title: 'Credentials error'
    });

    /*return this.doRequest({
      url: '/',
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      }
    });*/
  }


  /**
   * Perform an HTTP request.
   *
   * @param  {Object} options
   * @return {Promise}
   */
  doRequest(options) {
    options.headers = {'Content-Type': 'application/json'};

    return this.backendSrv.datasourceRequest(options);
  }
}
