const { createError } = require("../../utils/handleErrors");
const restaurant = require("./mongodb/Restaurant");

const config = require("config");
const DB = config.get("DB");

const createRestaurant = async (newRestaurant) => {
  if (DB === "mongodb") {
    try {
      let restaurant = new restaurant(newRestaurant);
      restaurant = await restaurant.save();
      return restaurant;
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  const error = new Error("there is no other db for this requests");
  error.status = 500;
  return createError("DB", error);
};

const getRestaurants = async () => {
  try {
    let restaurants = await restaurant.find();
    return restaurants;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const getRestaurant = async (restaurantId) => {
  try {
    let restaurant = await restaurant.findById(restaurantId);
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const getMyrestaurants = async (userId) => {
  try {
    let restaurants = await restaurant.find({ user_id: userId });
    return restaurants;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const updateRestaurant = async (restaurantId, newrestaurant) => {
  try {
    let restaurant = await restaurant.findByIdAndUpdate(restaurantId, newrestaurant, { new: true });
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const deleteRestaurant = async (restaurantId) => {
  try {
    let restaurant = await restaurant.findByIdAndDelete(restaurantId);
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const likeRestaurant = async (restaurantId, userId) => {
  try {
    let restaurant = await restaurant.findById(restaurantId);
    if (!restaurant) {
      const error = new Error(
        "A restaurant with this ID cannot be found in the database"
      );
      error.status = 404;
      return createError("Mongoose", error);
    }
    if (restaurant.likes.includes(userId)) {
      let newLikesArray = restaurant.likes.filter((id) => id != userId);
      restaurant.likes = newLikesArray;
    } else {
      restaurant.likes.push(userId);
    }
    await restaurant.save();
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  getMyrestaurants,
  updateRestaurant,
  deleteRestaurant,
  likeRestaurant,
};
