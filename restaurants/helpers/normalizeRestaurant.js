const { generateBizNumber } = require("./generateBizNumber");

const normalizeRestaurant = async (rawRestaurant, userId) => {
  return {
    ...rawRestaurant,
    image: {
      url:
        rawRestaurant.image.url ||
        "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
      alt: rawRestaurant.image.alt || "Business restaurant image",
    },
    bizNumber: rawRestaurant.bizNumber || (await generateBizNumber()),
    user_id: rawRestaurant.user_id || userId,
  };
};

module.exports = { normalizeRestaurant };
