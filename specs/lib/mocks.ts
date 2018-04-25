const $q = require('q');
const config = require('../../src/config.json');

function getHeaders(header) {
  switch (header) {
    case 'X-Vc-Meta-From':
      return 123456789;
    case 'X-Vc-Meta-Until':
      return 987654321;
  }

  return 0;
}

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
      hosts: {
        success: {
          data: {
            data: [{ id: 1, name: 'testing-host-1', type: 'mysql' }],
          },
        },
      },
    },
    POST: {
      'metrics/query-series': {
        success: {
          data: {
            data: [
              {
                total: 1,
                elements: [
                  {
                    rank: 1,
                    metric: 'host.queries.q.df1855d5cf5d39ca.tput',
                    series: [0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1],
                  },
                ],
              },
            ],
          },
          headers: getHeaders,
        },
      },
    },
  },
  datasourceRequest: function(options) {
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
