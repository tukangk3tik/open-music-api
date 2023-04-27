const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const {
  mapAlbumListToModel,
  mapSingleAlbumToModel,
} = require('../../utils/mapper/album_map');

const NotFoundException = require('../../exceptions/NotFoundException');
const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);
class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async getAlbums() {
    const albums = await this._pool.query('SELECT * FROM albums');
    return albums.rows.map(mapAlbumListToModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException('Album tidak ditemukan');
    }
    console.log(result.rows[0]);
    return mapSingleAlbumToModel(result.rows[0]);
  }

  async addAlbum({name, year}) {
    let id = nanoid(16).toString();
    id = 'album-' + id;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantErrorException('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async updateAlbum(id, {name, year}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums' +
        ' SET name = $1, year = $2, updated_at = $3' +
        ' WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException(
          'Gagal memperbarui album. Album tidak ditemukan',
      );
    }
  }

  async deleteAlbum(id) {
    const failMsg = 'Gagal menghapus album. ';

    const checkSongsQuery = {
      text: 'SELECT id FROM songs WHERE album_id = $1',
      values: [id],
    };
    const checkResult = await this._pool.query(checkSongsQuery);
    if (checkResult.rows.length) {
      throw new NotFoundException(
          `${failMsg}Album masih memiliki lagu`,
      );
    }

    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException(
          `${failMsg}Album tidak ditemukan`,
      );
    }
  }

  async updateAlbumCover(id, path) {
    const oldData = await this.getAlbumById(id);

    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums' +
        ' SET cover = $1, updated_at = $2' +
        ' WHERE id = $3 RETURNING id',
      values: [path, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException(
          'Gagal memperbarui sampul album. Album tidak ditemukan',
      );
    }

    return {
      oldCover: oldData.coverUrl,
      newCover: path,
    };
  }

  async likeAlbum(albumId, userId) {
    const id = 'albumlike-' + nanoid(16);
    const createdAt = new Date().toISOString();

    const isLike = await this.isUserLikeAlbum(albumId, userId);
    if (isLike) {
      throw new InvariantErrorException('Anda sudah melakukan like.');
    }

    const query = {
      text: 'INSERT INTO album_user_likes' +
        ' VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, albumId, userId, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantErrorException('Gagal melakukan like.');
    }
  }

  async unlikeAlbum(albumId, userId) {
    const isLike = await this.isUserLikeAlbum(albumId, userId);
    if (!isLike) {
      throw new InvariantErrorException(
          'Anda belum melakukan like sebelumnya.',
      );
    }

    const query = {
      text: 'DELETE FROM album_user_likes' +
        ' WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantErrorException('Gagal melakukan unlike.');
    }
  }

  async getAllLikes(albumId) {
    const query = {
      text: 'SELECT id FROM album_user_likes' +
        ' WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async isUserLikeAlbum(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_user_likes' +
        ' WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return false;
    }

    return true;
  }
}

module.exports = AlbumService;
