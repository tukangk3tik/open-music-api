const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantErrorException');
const config = require('../../utils/config');

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, config.jwt.access_token_key),

  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, config.jwt.refresh_token_key),

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwt.refresh_token_key);
      const {payload} = artifacts.decoded;
      return payload;
    } catch (err) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
