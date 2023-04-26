const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantErrorException');
const NotFoundError = require('../../exceptions/NotFoundException');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async addUser({username, password, fullname}) {
    await this.checkUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashPass = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, username, hashPass, fullname, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async checkUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(
          'Gagal menambahkan user, username sudah digunakan',
      );
    }
  }

  async verifyUserCredentials(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    const errMsg = 'Kredensial yang Anda berikan salah';
    if (!result.rowCount) {
      throw new AuthenticationError(errMsg);
    }

    const {id, password: hashedPassword} = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError(errMsg);
    }

    return id;
  }
}

module.exports = UserService;
