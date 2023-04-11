const {
  successResp, httpStatusCode,
  successRespMsg, failHandler,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return successResp(albums);
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const album = await this._service.getAlbumById(id);
      return successResp({album: album});
    } catch (e) {
      return failHandler(h, e);
    }
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {name, year} = request.payload;

      const albumId = await this._service.addAlbum({name, year});

      const msg = 'Album berhasil ditambahkan';
      const response = h.response(successRespMsg({albumId}, msg));
      response.code(httpStatusCode.created);
      return response;
    } catch (e) {
      return failHandler(h, e);
    }
  }

  async putAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const {id} = request.params;

      await this._service.updateAlbum(id, request.payload);

      const msg = 'Album berhasil diperbarui';
      return successRespMsg(null, msg);
    } catch (e) {
      return failHandler(h, e);
    }
  }

  async deleteAlbumHandler(request, h) {
    try {
      const {id} = request.params;

      await this._service.deleteAlbum(id);

      const msg = 'Album berhasil dihapus';
      return successRespMsg(null, msg);
    } catch (e) {
      return failHandler(h, e);
    }
  }
}

module.exports = AlbumHandler;
