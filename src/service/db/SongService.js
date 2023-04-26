const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const {
  mapSongListToModel,
  mapSingleSongToModel,
} = require('../../utils/mapper/song_map');

const NotFoundException = require('../../exceptions/NotFoundException');
const InvariantErrorException = require(
    '../../exceptions/InvariantErrorException',
);

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs({title, performer}) {
    let querySearch = '';
    if (title || performer) {
      const searchParam = [];

      if (title) {
        searchParam.push(`LOWER(title) LIKE LOWER('%${title}%')`);
      }

      if (performer) {
        searchParam.push(`LOWER(performer) LIKE LOWER('%${performer}%')`);
      }

      if (searchParam.length) {
        querySearch = ' WHERE ' + searchParam.join(' AND ');
      }
    }

    const songs = await this._pool.query('SELECT * FROM songs' + querySearch);
    return {songs: songs.rows.map(mapSongListToModel)};
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException('Lagu tidak ditemukan');
    }

    return mapSingleSongToModel(result.rows[0]);
  }

  async getSongByAlbums(albumId) {
    const getSongsQuery = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    };
    const getSongs = await this._pool.query(getSongsQuery);
    return getSongs.rows.map(mapSongListToModel);
  }

  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = 'song-' + nanoid(16);
    const createdAt = new Date().toISOString();
    const songDuration = (!duration) ? null : duration;
    const album = (!albumId) ? null : albumId;

    const query = {
      text: 'INSERT INTO songs' +
        ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer,
        songDuration, album, createdAt, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantErrorException('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async updateSong(id, {title, year, genre, performer, duration, albumId}) {
    const updatedAt = new Date().toISOString();
    const songDuration = (!duration) ? null : duration;
    const album = (!albumId) ? null : albumId;

    const query = {
      text: 'UPDATE songs' +
        ' SET title = $1, year = $2, genre = $3' +
        ', performer = $4, duration = $5' +
        ', album_id = $6, updated_at = $7' +
        ' WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer,
        songDuration, album, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException(
          'Gagal memperbarui lagu. Lagu tidak ditemukan',
      );
    }
  }

  async deleteSong(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException(
          `Lagu gagal dihapus. Lagu tidak ditemukan`,
      );
    }
  }
}

module.exports = SongService;
