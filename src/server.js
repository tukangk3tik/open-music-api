require('dotenv').config();

const config = require('../utils/config');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const albums = require('./api/albums');
const AlbumService = require('./service/db/AlbumService');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongService = require('./service/db/SongService');
const SongValidator = require('./validator/songs');

const users = require('./api/users');
const UserService = require('./service/db/UserService');
const UserValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthService = require('./service/db/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthValidator = require('./validator/authentication');

const playlists = require('./api/playlists');
const PlaylistService = require('./service/db/PlaylistService');
const PlaylistValidator = require('./validator/playlists');

const collaborations = require('./api/collaborations');
const CollabService = require('./service/db/CollaborationService');
const CollabValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./service/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');

const StorageService = require('./service/storage/StorageService');
const ImageValidator = require('./validator/uploads');
const CacheService = require('./service/redis/CacheService');

const _uploads = require('./api/upload');

const ClientError = require('./exceptions/ClientError');
const {failResp, httpStatusCode} = require('./utils/http/response');

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);
  const songService = new SongService();
  const userService = new UserService();
  const authService = new AuthService();
  const collabService = new CollabService();
  const playlistService = new PlaylistService(collabService, songService);
  const storageService = new StorageService(
      path.resolve(__dirname, 'api/upload/files/images'),
  );

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('auth_jwt', 'jwt', {
    keys: config.jwt.access_token_key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.access_token_age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumService,
        songService,
        storageService,
        albumValidator: AlbumValidator,
        imageValidator: ImageValidator,
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
    {
      plugin: authentications,
      options: {
        authService,
        userService,
        tokenManager: TokenManager,
        validator: AuthValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistService,
        collabService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collabService,
        playlistService,
        userService,
        validator: CollabValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        playlistService: playlistService,
        validator: ExportValidator,
      },
    },
    {
      plugin: _uploads,
      options: {},
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
