const mapAlbumListToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapSingleAlbumToModel = ({
  id,
  name,
  year,
  cover,
  songs,
}) => {
  return {
    id,
    name,
    year,
    coverUrl: cover,
    songs,
  };
};

module.exports = {
  mapAlbumListToModel,
  mapSingleAlbumToModel,
};
