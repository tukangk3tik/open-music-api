const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {playlistService, collabService, validator}) => {
    const playlistHandler = new PlaylistHandler(
        playlistService,
        collabService,
        validator,
    );
    server.route(routes(playlistHandler));
  },
};
