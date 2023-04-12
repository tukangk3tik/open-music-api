const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
const {
  LoginPayloadSchema,
  RefreshTokenPayloadSchema,
  LogoutPayloadSchema,
} = require('./schema');

const AuthenticationValidator = {
  validateLoginPayload: (payload) => {
    const result = LoginPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
  validateRefershTokenPayload: (payload) => {
    const result = RefreshTokenPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
  validateLogoutPayload: (payload) => {
    const result = LogoutPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantErrorException(result.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
