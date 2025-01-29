const express = require("express");
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  getMyRestaurants,
  updateRestaurant,
  deleteRestaurant,
  likeRestaurant,
} = require("../models/restaurantsAccessDataService"); // ✅ Ensure this file exists

const Restaurant = require("../models/mongodb/Restaurant"); // ✅ Ensure this file exists
const auth = require("../../auth/authService"); // ✅ Ensure correct path
const { normalizeRestaurant } = require("../helpers/normalizeRestaurant"); // ✅ Ensure this file exists
const { handleError } = require("../../utils/handleErrors"); // ✅ Ensure correct path
const validateRestaurant = require("../validation/restaurantValidationService"); // ✅ Ensure correct path

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { error } = validateRestaurant(req.body);
    if (error) {
      return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: User ID is missing" });
    }

    const normalizedRestaurant = normalizeRestaurant(req.body);
    const newRestaurant = new Restaurant(normalizedRestaurant);
    await newRestaurant.save();

    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// ✅ Other routes remain unchanged
router.get("/", async (req, res) => {
  try {
    let restaurants = await getRestaurants();
    res.send(restaurants);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.get("/my-restaurants", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      return handleError(res, 403, "Only business user can get my restaurant");
    }
    let restaurant = await getMyRestaurants(userInfo._id);
    res.send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let restaurant = await getRestaurant(id);
    res.send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const newRestaurant = req.body;
    const { id } = req.params;
    const fullrestaurantFromDb = await getRestaurant(id);
    if (
      userInfo._id !== fullrestaurantFromDb.user_id.toString() &&
      !userInfo.isAdmin
    ) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the user who created the business restaurant or admin can update its details"
      );
    }

    const errorMessage = validateRestaurant(newRestaurant);
    if (errorMessage !== "") {
      return handleError(res, 400, "Validation error: " + errorMessage);
    }

    let restaurant = await normalizeRestaurant(newRestaurant, userInfo._id);
    restaurant = await updateRestaurant(id, restaurant);
    res.send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;
    const fullrestaurantFromDb = await getRestaurant(id);
    if (
      userInfo._id !== fullrestaurantFromDb.user_id.toString() &&
      !userInfo.isAdmin
    ) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the user who created the business restaurant or admin can delete this restaurant"
      );
    }

    let restaurant = await deleteRestaurant(id);
    res.send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    let restaurant = await likeRestaurant(id, userId);
    res.send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

module.exports = router;
