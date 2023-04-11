const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantErrorException');

class AuthenticationService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO authentication VALUES ($1, $2, $2)',
      values: [token, createdAt],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationService;
