const express = require("express");
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
  likeRestaurant,
} = require("../models/restaurantsAccessDataService");

const Restaurant = require("../models/mongodb/Restaurant"); // ✅ Ensure this file exists
const User = require("../../users/models/mongodb/User"); // ✅ Added User model for reservations
const auth = require("../../auth/authService"); // ✅ Ensure correct path
const { normalizeRestaurant } = require("../helpers/normalizeRestaurant");
const { handleError } = require("../../utils/handleErrors");
const validateRestaurant = require("../validation/restaurantValidationService");

const router = express.Router();



router.post("/", auth, async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: User ID is missing" });
    }

    const { error } = validateRestaurant(req.body);
    if (error) {
      return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
    }

    const normalizedRestaurant = normalizeRestaurant(req.body, req.user._id);
    const newRestaurant = new Restaurant(normalizedRestaurant);
    await newRestaurant.save();

    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});



router.get("/", async (req, res) => {
  try {
    const restaurants = await getRestaurants();
    res.send(restaurants);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});


router.get("/my-restaurants", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      return handleError(res, 403, "Only business users can get their restaurants");
    }
    const restaurants = await getMyRestaurants(userInfo._id);
    res.send(restaurants);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

// ✅ Get a single restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await getRestaurant(id);
    res.send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

// ✅ Update a restaurant
router.put("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const newRestaurant = req.body;
    const { id } = req.params;

    const restaurantFromDb = await getRestaurant(id);
    if (!restaurantFromDb) {
      return handleError(res, 404, "Restaurant not found");
    }

    if (userInfo._id !== restaurantFromDb.user_id.toString() && !userInfo.isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the restaurant owner or an admin can update this restaurant"
      );
    }

    const { error } = validateRestaurant(newRestaurant);
    if (error) {
      return handleError(res, 400, `Validation error: ${error.details[0].message}`);
    }

    const updatedRestaurant = normalizeRestaurant(newRestaurant, userInfo._id);
    const savedRestaurant = await updateRestaurant(id, updatedRestaurant);
    res.send(savedRestaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

// ✅ Delete a restaurant
router.delete("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;

    const restaurantFromDb = await getRestaurant(id);
    if (!restaurantFromDb) {
      return handleError(res, 404, "Restaurant not found");
    }

    if (userInfo._id !== restaurantFromDb.user_id.toString() && !userInfo.isAdmin) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the restaurant owner or an admin can delete this restaurant"
      );
    }

    await deleteRestaurant(id);
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.patch("/:id/like", auth, async (req, res) => {
  try {
    const { id } = req.params; // ✅ Get restaurant ID
    const userId = req.user._id; // ✅ Get authenticated user ID

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing from the request" });
    }

    console.log("🔵 Like request received:", { restaurantId: id, userId });

    let updatedRestaurant = await likeRestaurant(id, userId);
    res.json(updatedRestaurant); // ✅ Return updated restaurant
  } catch (error) {
    console.error("❌ Server error updating like status:", error);
    res.status(500).json({ message: "Error updating like status", error: error.message });
  }
});









module.exports = router;
