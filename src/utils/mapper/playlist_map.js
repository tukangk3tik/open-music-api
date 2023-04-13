const mapPlaylistListToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapSinglePlaylistToModel = ({
  id,
  name,
  username,
  songs,
}) => ({
  id,
  name,
  username,
  songs,
});

const mapPlaylistActivityToModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

module.exports = {
  mapPlaylistListToModel,
  mapSinglePlaylistToModel,
  mapPlaylistActivityToModel,
};
