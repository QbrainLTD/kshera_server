const moment = require("moment");

const checkRestaurantStatus = (restaurant) => {
    if (!restaurant.openingHours || !restaurant.openingHours.from || !restaurant.openingHours.to) {
        return "סגור"; // Default to closed if opening hours are missing
    }

    const now = moment().format("HH:mm"); // Get the current time in HH:mm format
    const openingTime = moment(restaurant.openingHours.from, "HH:mm");
    const closingTime = moment(restaurant.openingHours.to, "HH:mm");

    return moment(now, "HH:mm").isBetween(openingTime, closingTime) ? "פתוח" : "סגור";
};

module.exports = checkRestaurantStatus;
