const {
  successResp, httpStatusCode,
  successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');
const config = require('../../../utils/config');
const path = require('path');

class AlbumHandler {
  constructor(
      albumService, songService, storageService,
      albumValidator, imageValidator,
  ) {
    this._albumService = albumService;
    this._songService = songService;
    this._storageService = storageService;
    this._albumValidator = albumValidator;
    this._imageValidator = imageValidator;

    this._appUrl = `http://${config.app.host}:${config.app.port}`;

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
    album.coverUrl = `${this._appUrl}/${album.coverUrl}`;
    album.songs = await this._songService.getSongByAlbums(id);
    return successResp({album: album});
  }

  async postAlbumHandler(request, h) {
    this._albumValidator.validateAlbumPayload(request.payload);
    const {name, year} = request.payload;

    const albumId = await this._albumService.addAlbum({name, year});

    const msg = 'Album berhasil ditambahkan';
    const response = h.response(successRespMsg({albumId}, msg));
    response.code(httpStatusCode.created);
    return response;
  }

  async putAlbumHandler(request, h) {
    this._albumValidator.validateAlbumPayload(request.payload);
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

  async updateAlbumCoverHandler(request, h) {
    const {cover} = request.payload;
    this._imageValidator.validateImageHeader(cover.hapi.headers);

    const {id} = request.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const filePath = `upload/files/images/${filename}`;
    let {oldCover} = await this._albumService.updateAlbumCover(id, filePath);

    if (oldCover && oldCover !== '') {
      oldCover = path.resolve(__dirname + '/../', oldCover);
      await this._storageService.removeFile(oldCover);
    }
    const msg = 'Cover album berhasil diperbarui';
    const response = h.response(successRespMsg(
        {fileLocation: `${this._appUrl}/${filePath}`},
        msg,
    ));
    response.code(httpStatusCode.created);
    return response;
  }
}

module.exports = AlbumHandler;
