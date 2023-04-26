const {Pool} = require('pg');
const NotFoundError = require('../../exceptions/NotFoundException');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantErrorException');
const {
  mapPlaylistListToModel,
  mapSinglePlaylistToModel,
  mapPlaylistActivityToModel,
} = require('../../utils/mapper/playlist_map');
const NotFoundException = require('../../exceptions/NotFoundException');
const {mapSongListToModel} = require('../../utils/mapper/song_map');

const action = {
  add: 'add',
  delete: 'delete',
};

class PlaylistService {
  constructor(collabService, songService) {
    this._pool = new Pool();
    this._collabService = collabService;
    this._songService = songService;
  }

  async getPlaylist(userId) {
    const query = {
      text: 'SELECT a.id, a.name, b.username FROM playlists a ' +
        'LEFT JOIN users b ON b.id = a.owner ' +
        'LEFT JOIN playlist_collaborations c ON c.playlist_id = a.id ' +
        'WHERE a.owner = $1 OR c.user_id = $1',
      values: [userId],
    };

    const playlist = await this._pool.query(query);
    return playlist.rows.map(mapPlaylistListToModel);
  }

  async createPlaylist({name, userId}) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, name, userId, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException(
          `Playlist gagal dihapus. Playlist tidak ditemukan`,
      );
    }
  }

  async addSongToPlaylist({playlistId, songId, userId}) {
    await this._songService.getSongById(songId);

    const checkQuery = {
      text: 'SELECT * FROM playlist_songs ' +
        'WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, userId],
    };

    const checkResult = await this._pool.query(checkQuery);
    if (checkResult.rowCount) {
      throw new InvariantError('Lagu sudah ada di playlist');
    }

    const id = `listsong-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, playlistId, songId, createdAt],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this.recordPlaylistActivity(playlistId, songId, userId, action.add);
  }

  async deleteSongFromPlaylist({playlistId, songId, userId}) {
    const query = {
      text: 'DELETE FROM playlist_songs ' +
        'WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus');
    }

    await this.recordPlaylistActivity(
        playlistId, songId, userId, action.delete,
    );
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: 'SELECT a.*, b.username FROM playlists a ' +
        'JOIN users b ON b.id = a.owner WHERE a.id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundException('Playlist tidak ditemukan');
    }

    const getSongsQuery = {
      text: 'SELECT b.* FROM playlist_songs a ' +
        'JOIN songs b ON b.id = a.song_id WHERE a.playlist_id = $1',
      values: [playlistId],
    };
    const getSongs = await this._pool.query(getSongsQuery);
    result.rows[0].songs = getSongs.rows.map(mapSongListToModel);

    return mapSinglePlaylistToModel(result.rows[0]);
  }

  async getActivities(playlistId) {
    const query = {
      text: 'SELECT b.username, c.title, a.action, a.time ' +
        'FROM playlist_song_activities a ' +
        'JOIN users b ON b.id = a.user_id ' +
        'JOIN songs c ON c.id = a.song_id WHERE playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapPlaylistActivityToModel);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collabService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async recordPlaylistActivity(
      playlistId,
      songId,
      userId,
      action,
  ) {
    const id = `activity-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities ' +
        'VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, createdAt],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistService;
