const {
  successResp, httpStatusCode,
  successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(playlistService, collabService, validator) {
    this._playlistService = playlistService;
    this._collabService = collabService;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async getPlaylistHandler(request) {
    const {id: userId} = request.auth.credentials;
    const playlists = await this._playlistService.getPlaylist(userId);
    return successResp({playlists: playlists});
  }

  async createPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const {name} = request.payload;
    const {id: userId} = request.auth.credentials;

    const playlistId =
      await this._playlistService.createPlaylist({name, userId});

    const response = h.response(successRespMsg(
        {playlistId: playlistId},
        'Playlist berhasil ditambahkan',
    ));
    response.code(httpStatusCode.created);
    return response;
  }

  async deletePlaylistHandler(request) {
    const {id} = request.params;
    const {id: credentialId} = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._playlistService.deletePlaylist(id);

    const msg = 'Playlist berhasil dihapus';
    return successRespMsg(null, msg);
  }

  async addSongToPlaylistHandler(request, h) {
    this._validator.validateAddSongPlaylistPayload(request.payload);

    const {id: playlistId} = request.params;
    const {songId} = request.payload;
    const {id: userId} = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, userId);

    await this._playlistService
        .addSongToPlaylist({playlistId, songId, userId});

    const response = h.response(successRespMsg(
        null,
        'Lagu berhasil ditambahkan ke playlist',
    ));
    response.code(httpStatusCode.created);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const {id: playlistId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const playlists = await this._playlistService.getPlaylistSongs(playlistId);
    return successResp({playlist: playlists});
  }

  async getPlaylistActivitiesHandler(request) {
    const {id: playlistId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const activities = await this._playlistService.getActivities(playlistId);
    return successResp({
      playlistId: playlistId,
      activities: activities,
    });
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validateDeleteSongPlaylistPayload(request.payload);

    const {id: playlistId} = request.params;
    const {songId} = request.payload;
    const {id: userId} = request.auth.credentials;
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    await this._playlistService.deleteSongFromPlaylist({
      playlistId,
      songId,
      userId,
    });

    return successRespMsg(
        null,
        'Lagu berhasil dihapus dari playlist'
    );
  }
}

module.exports = PlaylistHandler;
