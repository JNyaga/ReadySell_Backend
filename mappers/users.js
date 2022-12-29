const config = require("config");

const mapper = user => {
  const baseUrl = config.get("assetsBaseUrl");
  const mapImage = image => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`
  });

  return {
   ...user,
    image: mapImage(user.image),
  };
};

module.exports = mapper;

