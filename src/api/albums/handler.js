const {
  successResp, httpStatusCode,
  successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, songService, validator) {
    this._albumService = albumService;
    this._songService = songService;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async getAlbumsHandler() {
    const albums = await this._albumService.getAlbums();
    return successResp(albums);
  }

  async getAlbumByIdHandler(request) {
    const {id} = request.params;
    const album = await this._albumService.getAlbumById(id);
    album.songs = await this._songService.getSongByAlbums(id);
    return successResp({album: album});
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {name, year} = request.payload;

    const albumId = await this._albumService.addAlbum({name, year});

    const msg = 'Album berhasil ditambahkan';
    const response = h.response(successRespMsg({albumId}, msg));
    response.code(httpStatusCode.created);
    return response;
  }

  async putAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {id} = request.params;

    await this._albumService.updateAlbum(id, request.payload);

    const msg = 'Album berhasil diperbarui';
    return successRespMsg(null, msg);
  }

  async deleteAlbumHandler(request, h) {
    const {id} = request.params;

    await this._albumService.deleteAlbum(id);

    const msg = 'Album berhasil dihapus';
    return successRespMsg(null, msg);
  }
}

module.exports = AlbumHandler;
