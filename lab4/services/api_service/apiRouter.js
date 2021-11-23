const executors = require('./executors').default;

const routes = {
  '/api/some-api-service/addBank': { accessRequired: 0, executor: (args) => executors.addBank(args), contentType: 'text/plain' },
  '/api/some-api-service/notification': { accessRequired: 0, executor: (args) => executors.notificate(args), contentType: 'text/plain' },
  '/404': { accessRequired: 0, executor: () => ({ data: null, err: '404' }), contentType: 'text/plain' },
  '/api/some-api-service/crash': { accessRequired: 0, executor: () => ({ data: null, err: '404' }), contentType: 'text/plain' },
};


const getRoute = (routeStr, access) => {
  const route = routes[routeStr];
  if (!route) return routes['/404'];
  if (access < route.access) return new Error('Not enough access level!');
  return route;
};


module.exports = {
  getRoute,
};
