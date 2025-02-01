const express = require("express");
const {
  registerUser,
  getUser,
  getUsers,
  loginUser,
} = require("../models/usersAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const {
  validateRegistration,
  validateLogin,
} = require("../validation/userValidationService");
const User = require("../models/mongodb/User");
const Restaurant = require("../../restaurants/models/mongodb/Restaurant");
const mongoose = require("mongoose"); // ✅ Add this line

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const error = validateRegistration(req.body);
    if (error) return handleError(res, 400, `Joi Error: ${error}`);

    let user = await registerUser(req.body);
    res.send(user);
  } catch (error) {
    return handleError(res, error.status || 400, error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const error = validateLogin(req.body);
    if (error) return handleError(res, 400, `Joi Error: ${error}`);

    let { email, password } = req.body;
    const token = await loginUser(email, password);
    res.send(token);
  } catch (error) {
    return handleError(res, error.status || 400, error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;

    if (userInfo._id !== id && !userInfo.isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the same user or admin can get user info"
      );
    }

    let user = await getUser(id);
    res.send(user);
  } catch (error) {
    return handleError(res, error.status || 400, error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    let users = await getUsers();
    res.send(users);
  } catch (error) {
    return handleError(res, error.status || 400, error.message);
  }
});

// ✅ Reserve a restaurant for a user
router.post("/:userId/reserve", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { restaurantId } = req.body;

    if (req.user._id.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: You can only reserve for yourself" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    // ✅ Prevent duplicate reservations
    if (user.reservations.includes(restaurantId)) {
      return res.status(400).json({ message: "You already have a reservation at this restaurant" });
    }

    // ✅ Add reservation
    user.reservations.push(restaurantId);
    await user.save();

    res.json({ message: "Reservation saved successfully", newReservation: restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error saving reservation", error: error.message });
  }
});

// ✅ Cancel (Remove) a reservation
router.delete("/:userId/reservations/:restaurantId", auth, async (req, res) => {
  try {
    const { userId, restaurantId } = req.params;

    if (req.user._id.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: You can only cancel your own reservations" });
    }

    // ✅ Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check if the reservation exists
    if (!user.reservations.includes(restaurantId)) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // ✅ Remove the reservation
    user.reservations = user.reservations.filter(id => id.toString() !== restaurantId);
    await user.save();

    res.json({ message: "Reservation canceled successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error canceling reservation", error: error.message });
  }
});






// ✅ Get user reservations
router.get("/:userId/reservations", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: You can only view your own reservations" });
    }

    const user = await User.findById(userId).populate("reservations");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user._id.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own profile." });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🟢 Merge address & name objects with existing values
    const updatedUser = {
      ...existingUser._doc,  // Keep existing user data
      ...req.body,           // Merge with new updates
      name: { ...existingUser.name, ...req.body.name },  // Merge name fields
      address: { ...existingUser.address, ...req.body.address }, // Merge address fields
    };

    const savedUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });

    res.json(savedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error updating user", error: error.message });
  }
});





module.exports = router;
