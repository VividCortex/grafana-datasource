const $q = require('q');
const config = require('../../src/config.json');

const backendSrv = {
  requests: {
    GET: {
      metrics: {
        status: 200,
      },
    },
  },
  datasourceRequest: options => {
    const endpoint = options.url.replace(config.apiUrl, ''),
      response = backendSrv.requests[options.method][endpoint];

    if (!response) {
      console.error('Backend request mock not found.');
    }

    return $q.when(response || {});
  },
};

const templateSrv = {};

export { backendSrv, templateSrv };
