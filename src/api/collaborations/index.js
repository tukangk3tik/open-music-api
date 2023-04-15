const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collabService, playlistService, userService, validator,
  }) => {
    const collabHandler = new CollaborationHandler(
        collabService, playlistService, userService, validator,
    );
    server.route(routes(collabHandler));
  },
};
