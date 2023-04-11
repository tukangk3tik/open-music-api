
exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
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
  pgm.dropTable('authentications');
};
