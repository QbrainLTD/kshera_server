const { createError } = require("../../utils/handleErrors");
const Restaurant = require("./mongodb/Restaurant"); 
const checkRestaurantStatus = require("../helpers/checkRestaurantStatus");
const config = require("config");
const DB = config.get("DB");

const createRestaurant = async (newRestaurant) => {
  if (DB === "mongodb") {
    try {
      let restaurant = new Restaurant(newRestaurant); 
      restaurant = await restaurant.save();
      return restaurant;
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  const error = new Error("there is no other db for this request");
  error.status = 500;
  return createError("DB", error);
};

const getRestaurants = async () => {
  let restaurants = await Restaurant.find(); 
  restaurants = restaurants.map((restaurant) => ({
    ...restaurant.toObject(),
    status: checkRestaurantStatus(restaurant),
  }));
  return restaurants;
};

const getRestaurant = async (restaurantId) => {
  try {
    let restaurant = await Restaurant.findById(restaurantId); 
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const getMyRestaurants = async (userId) => {
  try {
    let restaurants = await Restaurant.find({ user_id: userId }); 
    return restaurants;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const updateRestaurant = async (restaurantId, newrestaurant) => {
  try {
    let restaurant = await Restaurant.findByIdAndUpdate(restaurantId, newrestaurant, { new: true }); 
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const deleteRestaurant = async (restaurantId) => {
  try {
    let restaurant = await Restaurant.findByIdAndDelete(restaurantId); 
    return restaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const likeRestaurant = async (restaurantId, userId) => {
  try {
    let restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return createError("Mongoose", new Error("Restaurant not found"));
    }

    // ✅ Toggle Like
    let updatedLikes;
    if (restaurant.likes.includes(userId)) {
      updatedLikes = restaurant.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      updatedLikes = [...restaurant.likes, userId];
    }

    // ✅ Use `findByIdAndUpdate` instead of `save()`
    let updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { likes: updatedLikes }, // ✅ Only update `likes`
      { new: true }
    );

    return updatedRestaurant;
  } catch (error) {
    return createError("Mongoose", error);
  }
};



module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  getMyRestaurants, 
  updateRestaurant,
  deleteRestaurant,
  likeRestaurant,
};
