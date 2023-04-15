const {
  successResp, httpStatusCode, successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(collabService, playlistService, userService, validator) {
    this._collabService = collabService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async addCollaboratorHandler(request, h) {
    this._validator.validateAddCollaborationPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._userService.getUserById(userId);

    const collabId = await this._collabService.addCollaboration(
        playlistId, userId,
    );

    const response = h.response(successResp(
        {collaborationId: collabId}),
    );
    response.code(httpStatusCode.created);
    return response;
  }

  async deleteCollaboratorHandler(request) {
    this._validator.validateDeleteCollaborationPayload(request.payload);
    const {id: credentialId} = request.auth.credentials;
    const {playlistId, userId} = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collabService.deleteCollaboration(playlistId, userId);

    return successRespMsg(null, 'Kolaborasi berhasil dihapus');
  }
}

module.exports = CollaborationHandler;
