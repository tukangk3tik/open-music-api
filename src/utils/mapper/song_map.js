const mapSongListToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapSingleSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = {
  mapSongListToModel,
  mapSingleSongToModel,
};
