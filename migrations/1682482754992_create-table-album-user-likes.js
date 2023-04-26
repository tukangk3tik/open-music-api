/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('album_user_likes', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: '"albums"',
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
  pgm.dropTable('album_user_likes');
};
