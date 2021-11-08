const executors = require('./executors').default;

const routes = {
  '/': { accessRequired: 0, executor: (args) => executors.makeCalls(args), contentType: 'text/plain' },
  '/crash': { accessRequired: 0, executor: (args) => executors.crash(args), contentType: 'text/plain' },
  '/callDb': { accessRequired: 0, executor: () => executors.callDb(), contentType: 'text/plain' },
  '/404': { accessRequired: 0, executor: () => ({ data: null, err: '404' }), contentType: 'text/plain' },
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
