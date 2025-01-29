const moment = require("moment");

const checkRestaurantStatus = (openingHours) => {
  if (!openingHours?.from || !openingHours?.to) {
    return "סגור"; // Default to closed if no hours are provided
  }

  const now = moment().format("HH:mm");
  const openingTime = moment(openingHours.from, "HH:mm");
  const closingTime = moment(openingHours.to, "HH:mm");

  return moment(now, "HH:mm").isBetween(openingTime, closingTime) ? "פתוח" : "סגור";
};

const normalizeRestaurant = (restaurant, userId) => {
  return {
    name: restaurant.name,
    country: restaurant.country || "",
    city: restaurant.city || "",
    street: restaurant.street || "",
    rating: restaurant.rating || 0,
    status: "סגור", // Default status to סגור, will update dynamically
    kosher: restaurant.kosher ?? false,
    tags: Array.isArray(restaurant.tags) ? restaurant.tags : [],
    description: restaurant.description || "",
    imageUrl: restaurant.imageUrl || "https://qbrain.co.il/wp-content/uploads/2025/01/logo.png",
    openingHours: {
      from: restaurant.openingHours?.from || "09:00",
      to: restaurant.openingHours?.to || "22:00",
    },
    user_id: restaurant.user_id || userId,
  };
};

module.exports = { normalizeRestaurant };








