const {
  successResp, httpStatusCode,
  successRespMsg, failHandler,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async getSongsHandler(request, _) {
    const title = request.query.title;
    const performer = request.query.performer;

    const songs = await this._service.getSongs({title, performer});
    return successResp(songs);
  }

  async getSongByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const song = await this._service.getSongById(id);
      return successResp({song: song});
    } catch (e) {
      return failHandler(h, e);
    }
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {title, year, genre, performer, duration, albumId} =
          request.payload;

      const songId = await this._service.addSong(
          {title, year, genre, performer, duration, albumId},
      );

      const msg = 'Lagu berhasil ditambahkan';
      const response = h.response(successRespMsg({songId: songId}, msg));
      response.code(httpStatusCode.created);
      return response;
    } catch (e) {
      return failHandler(h, e);
    }
  }

  async putSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {id} = request.params;

      await this._service.updateSong(id, request.payload);

      const msg = 'Lagu berhasil diperbarui';
      return successRespMsg(null, msg);
    } catch (e) {
      return failHandler(h, e);
    }
  }

  async deleteSongHandler(request, h) {
    try {
      const {id} = request.params;

      await this._service.deleteSong(id);

      const msg = 'Lagu berhasil dihapus';
      return successRespMsg(null, msg);
    } catch (e) {
      return failHandler(h, e);
    }
  }
}

module.exports = SongHandler;
