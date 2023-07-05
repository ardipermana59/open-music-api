const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const queryPlaylist = `
      SELECT playlists.id, playlists.name, users.username
      FROM playlist_songs
      INNER JOIN playlists ON playlist_songs.playlist_id = playlists.id
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlist_id = $1
      LIMIT 1
    `;

    const queryUser = `
      SELECT username
      FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1
      LIMIT 1
    `;

    const querySongs = `
      SELECT songs.id, songs.title, songs.performer
      FROM playlist_songs
      INNER JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist_id = $1
    `;

    const resultPlaylist = await this.pool.query(queryPlaylist, [playlistId]);
    const resultUser = await this.pool.query(queryUser, [playlistId]);
    const resultSongs = await this.pool.query(querySongs, [playlistId]);

    if (!resultPlaylist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = {
      id: resultPlaylist.rows[0].id,
      name: resultPlaylist.rows[0].name,
      songs: resultSongs.rows,
    };

    return { playlist };
  }
}

module.exports = PlaylistsService;
