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
  songs,
}) => ({
  id,
  name,
  year,
  songs,
});

module.exports = {
  mapAlbumListToModel,
  mapSingleAlbumToModel,
};
