const executors = require('./executors').default;

const routes = {
  '/getBanks': { accessRequired: 0, executor: () => executors.getBanks(), contentType: 'text/plain' },
  '/isUniqueBankName': { accessRequired: 0, executor: (args) => executors.isUniqueBankName(args), contentType: 'text/plain' },
  '/updateBank': { accessRequired: 0, executor: (args) => executors.updateBank(args), contentType: 'text/plain' },
  '/removeBank': { accessRequired: 0, executor: (args) => executors.removeBank(args), contentType: 'text/plain' },
  '/addBank': { accessRequired: 0, executor: (args) => executors.addBank(args), contentType: 'text/plain' },
  '/404': { accessRequired: 0, executor: () => ({ data: null, err: '404' }), contentType: 'text/plain' },
  '/crash': { accessRequired: 0, executor: () => ({ data: null, err: '404' }), contentType: 'text/plain' },
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
