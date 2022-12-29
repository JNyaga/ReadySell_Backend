const config = require("config");

const mapper = message => {
  const baseUrl = config.get("assetsBaseUrl");
  const mapImage = image => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`
  });

  return {
    ...message,
    fromUserId:{
      ...message.fromUserId,
      image: mapImage(message.fromUserId.image)
    },
    toUserId:{
      ...message.toUserId,
      image: mapImage(message.toUserId.image)
    },

  };
};

module.exports = mapper;
