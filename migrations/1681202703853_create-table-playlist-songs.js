
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlists"',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: '"songs"',
      notNull: true,
    },
    created_at: {
      type: 'datetime',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
