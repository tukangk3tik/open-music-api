const {
  httpStatusCode,
  successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class ExportHandler {
  constructor(producerService, playListService, validator) {
    this._producerService = producerService;
    this._playlistService = playListService;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPayload(request.payload);

    const {id: userId} = request.auth.credentials;
    const {id} = request.params;
    await this._playlistService.verifyPlaylistOwner(id, userId);

    const message = {
      userId: userId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage(
        'export:playlists',
        JSON.stringify(message),
    );

    const msg = 'Permintaan anda sedang diproses';
    const response = h.response(successRespMsg(null, msg));
    response.code(httpStatusCode.created);
    return response;
  }
}

module.exports = ExportHandler;
