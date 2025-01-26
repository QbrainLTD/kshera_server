const validateRestaurantWithJoi = require("./Joi/validateRestaurantWithJoi");
const config = require("config");
const validator = config.get("VALIDATOR");

const validateRestaurant = (restaurant) => {
  if (validator === "joi") {
    const { error } = validateRestaurantWithJoi(restaurant);
    if (error) return error.details[0].message;
    return "";
  }
};

module.exports = validateRestaurant;
