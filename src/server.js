require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./service/db/AlbumService');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongService = require('./service/db/SongService');
const SongValidator = require('./validator/songs');

const users = require('./api/users');
const UserService = require('./service/db/UserService');
const UserValidator = require('./validator/users');

const ClientError = require('./exceptions/ClientError');
const {failResp, httpStatusCode} = require('./utils/http/response');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
  ]);

  // error handling
  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response(failResp('fail', response.message));

        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response(
          failResp('error', 'Terjadi kegagalan pada server'),
      );
      newResponse.code(httpStatusCode.serverError);
      return newResponse;
    }

    // tidak terdapat error, request dilanjutkan
    return h.continue;
  });

  await server.start();
  console.log(`Server has started at ${server.info.uri}`);
};

init();
