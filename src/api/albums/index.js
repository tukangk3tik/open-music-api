const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumService, songService, storageService,
    albumValidator, imageValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(
        albumService, songService, storageService,
        albumValidator, imageValidator,
    );
    server.route(routes(albumsHandler));
  },
};
