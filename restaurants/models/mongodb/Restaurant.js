const mongoose = require("mongoose");
const {
  DEFAULT_VALIDATION,
  PHONE,
  EMAIL,
  URL,
} = require("../../../helpers/mongodb/mongooseValidators");
const Image = require("../../../helpers/mongodb/Image");
const Address = require("../../../helpers/mongodb/Address");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
  status: { type: String, default: "סגור" },
  distance: { type: String, default: "0 ק''מ" },
  kosher: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  description: { type: String },
  imageUrl: { type: String },
  isLiked: { type: Boolean, default: false }, // Add isLiked with a default value
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const restaurant = mongoose.model("restaurant", restaurantSchema);

module.exports = restaurant;
