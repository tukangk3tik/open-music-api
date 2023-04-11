const {
  successResp, httpStatusCode,
  successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async createUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const {username, password, fullname} = request.payload;

    const userId = await this._service.addUser(
        {username, password, fullname},
    );

    const msg = 'User berhasil ditambahkan';
    const response = h.response(successRespMsg({userId: userId}, msg));
    response.code(httpStatusCode.created);
    return response;
  }

  async getUserByIdHandler(request, _) {
    const {id} = request.params;
    const user = await this._service.getUserById(id);
    return successResp({user: user});
  }
}

module.exports = UserHandler;
