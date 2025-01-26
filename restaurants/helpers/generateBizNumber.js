const _ = require("lodash");
const restaurant = require("../models/mongodb/Restaurant");
const { createError } = require("../../utils/handleErrors");

const generateBizNumber = async () => {
  let restaurantsCount = await restaurant.countDocuments();
  if (restaurantsCount === 9_000_000) {
    const error = new Error(
      "You reached to the maximum restaurants count in your system"
    );
    error.status = 409;
    return createError("Mogoose", error);
  }
  let random;
  do {
    random = _.random(1_000_000, 9_999_999);
  } while (await isBizNumberExists(random));

  return random;
};

const isBizNumberExists = async (bizNumber) => {
  try {
    const restaurantWithThisBizNumber = await restaurant.findOne({ bizNumber });
    return Boolean(restaurantWithThisBizNumber);
  } catch (error) {
    error.status = 500;
    return createError("Mogoose", error);
  }
};

module.exports = { generateBizNumber };
