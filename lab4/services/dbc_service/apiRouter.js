const executors = require('./executors').default;

const routes = {
  '/api/dbc-service/makeDBCall': { accessRequired: 0, executor: (args) => executors.makeDBCall(args), contentType: 'text/plain' },
  '/api/dbc-service/insertEmail': { accessRequired: 0, executor: (args) => executors.insertEmail(args), contentType: 'text/plain' },
  '/api/dbc-service/getAllEmails': { accessRequired: 0, executor: () => executors.getAllEmails(), contentType: 'text/plain' },
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
