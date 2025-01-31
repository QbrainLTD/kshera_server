const mongoose = require("mongoose"); // ✅ Ensure Mongoose is imported

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
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

  // ✅ Add Reservations Field
  reservations: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
});

// ✅ Convert _id to id when returning JSON
restaurantSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

// ✅ Update Status Before Saving
restaurantSchema.pre("save", function (next) {
  const now = new Date();
  const currentHour = now.getHours();
  const openHour = parseInt(this.openingHours.from.split(":")[0], 10);
  const closeHour = parseInt(this.openingHours.to.split(":")[0], 10);

  this.status = currentHour >= openHour && currentHour < closeHour ? "פתוח" : "סגור";
  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
