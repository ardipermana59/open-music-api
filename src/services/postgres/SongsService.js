const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapSongDB } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const fetch = await this._pool.query(query);

    if (!fetch.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return fetch.rows[0].id;
  }

  async getSongs(params) {
    let queryText = 'SELECT id, title, performer FROM songs WHERE 1=1';
    const queryValues = [];

    if (params.title) {
      queryText += ` and LOWER(title) LIKE $${queryValues.length + 1}`;
      queryValues.push(`%${params.title.toLowerCase()}%`);
    }

    if (params.performer) {
      queryText += ` and LOWER(performer) LIKE $${queryValues.length + 1}`;
      queryValues.push(`%${params.performer.toLowerCase()}%`);
    }

    const query = {
      text: queryText,
      values: queryValues,
    };

    const fetch = await this._pool.query(query);
    const songs = fetch.rows;

    return songs;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const fetch = await this._pool.query(query);

    if (!fetch.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return fetch.rows.map(mapSongDB)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };
    const fetch = await this._pool.query(query);

    if (!fetch.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const fetch = await this._pool.query(query);

    if (!fetch.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = SongsService;
