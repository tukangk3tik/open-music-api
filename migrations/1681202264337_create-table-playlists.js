
exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    owner: {
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
  pgm.dropTable('playlists');
};
