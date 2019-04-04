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
          data: {
            data: [
              { name: 'host.auth', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.callers', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.connections', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.dbs', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.queries', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.samples', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.status', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.tables', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.totals', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.users', firstSeen: 1508354400, lastSeen: 1527698640 },
              { name: 'host.verbs', firstSeen: 1508354400, lastSeen: 1527698640 },
            ],
          },
        },
        failure: {
          status: 401,
        },
        error: new Error('Internal server error'),
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
                elements: [
                  {
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
  datasourceRequest: options => {
    const endpoint = options.url.match(/(?:\/api\/v2\/)([\w\W]+)$/)[1],
      apiToken = options.headers.Authorization.replace('Bearer ', ''),
      response = backendSrv.requests[options.method][endpoint][apiToken];

    console.log(`calling ${options.method} ${endpoint}`);

    if (!response) {
      console.error('Backend request mock not found.');
    } else if (response instanceof Error) {
      return $q.reject(response);
    }

    return $q.when(response || {});
  },
};

const templateSrv = {
  replace: metric => metric.replace('$', ''),
};

export { backendSrv, templateSrv };
