const routes = (handler) => [
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'POST',
    path: '/users',
    handler: handler.createUserHandler,
  },
];

module.exports = routes;
