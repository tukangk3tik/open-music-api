
exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlists"',
      notNull: true,
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: '"songs"',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    time: {
      type: 'datetime',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};

