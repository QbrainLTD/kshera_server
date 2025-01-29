const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  rating: { type: Number, default: 0 },
  status: { type: String, default: "סגור" },
  kosher: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  description: { type: String },
  imageUrl: { type: String },
  isLiked: { type: Boolean, default: false },
  openingHours: {
    from: { type: String, required: true, default: "09:00" },
    to: { type: String, required: true, default: "22:00" },
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
});

restaurantSchema.pre("save", function (next) {
  const now = new Date();
  const currentHour = now.getHours();
  const openHour = parseInt(this.openingHours.from.split(":")[0], 10);
  const closeHour = parseInt(this.openingHours.to.split(":")[0], 10);

  if (currentHour >= openHour && currentHour < closeHour) {
    this.status = "פתוח";
  } else {
    this.status = "סגור";
  }

  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;


