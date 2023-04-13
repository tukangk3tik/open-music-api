
exports.up = (pgm) => {
  pgm.createTable('playlist_collaborations', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlists"',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      notNull: true,
    },
    created_at: {
      type: 'datetime',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_collaborations');
};
