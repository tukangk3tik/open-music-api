const {
  httpStatusCode,
  successRespMsg,
} = require('../../utils/http/response');
const autoBind = require('auto-bind');

class AuthenticationHandler {
  constructor(authService, userService, tokenManager, validator) {
    this._authService = authService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    // binding nilai this untuk seluruh method
    autoBind(this);
  }

  async loginHandler(request, h) {
    this._validator.validateLoginPayload(request.payload);
    const {username, password} = request.payload;

    const userId = await this._userService.verifyUserCredentials(
        username, password,
    );

    const accessToken = this._tokenManager.generateAccessToken({userId});
    const refreshToken = this._tokenManager.generateRefreshToken({userId});

    await this._authService.addRefreshToken(refreshToken);

    const response = h.response(successRespMsg(
        {accessToken, refreshToken},
        'Login berhasil',
    ));
    response.code(httpStatusCode.created);
    return response;
  }

  async refreshTokenHandler(request, _) {
    this._validator.validateRefershTokenPayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authService.verifyRefreshToken(refreshToken);
    const {id} = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({id});
    return successRespMsg({accessToken}, 'Access Token berhasil diperbarui');
  }

  async logoutHandler(request, _) {
    this._validator.validateLogoutPayload(request.payload);

    const {refreshToken} = request.payload;
    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);

    return successRespMsg(null, 'Logout berhasil');
  }
}

module.exports = AuthenticationHandler;
