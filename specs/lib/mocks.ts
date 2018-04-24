const $q = require('q');
const config = require('../../src/config.json');

const backendSrv = {
  requests: {
    GET: {
      metrics: {
        success: {
          status: 200,
        },
        error: {
          status: 500,
        },
      },
      'metrics/search': {
        success: {
          data: {
            data: [
              'host.auth',
              'host.callers',
              'host.connections',
              'host.dbs',
              'host.queries',
              'host.samples',
              'host.status',
              'host.tables',
              'host.totals',
              'host.users',
              'host.verbs',
            ],
          },
        },
      },
    },
  },
  datasourceRequest: options => {
    const endpoint = options.url.replace(config.apiUrl, ''),
      apiToken = options.headers.Authorization.replace('Bearer ', ''),
      response = backendSrv.requests[options.method][endpoint][apiToken];

    if (!response) {
      console.error('Backend request mock not found.');
    }

    return $q.when(response || {});
  },
};

const templateSrv = {
  replace: metric => metric,
};

export { backendSrv, templateSrv };
