
exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(100)',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    created_at: {
      type: 'datetime',
      notNull: true,
    },
    updated_at: {
      type: 'datetime',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
