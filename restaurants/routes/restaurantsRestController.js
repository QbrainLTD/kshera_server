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
const auth = require("../../auth/authService");
const { normalizeRestaurant } = require("../helpers/normalizeRestaurant");
const { handleError } = require("../../utils/handleErrors");
const validateRestaurant = require("../validation/restaurantValidationService");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      return handleError(res, 403, "Only business user can create new restaurant");
    }

    const errorMessage = validateRestaurant(req.body);
    if (errorMessage !== "") {
      return handleError(res, 400, "Validation error: " + errorMessage);
    }

    let restaurant = await normalizeRestaurant(req.body, userInfo._id);
    restaurant = await createRestaurant(restaurant);
    res.status(201).send(restaurant);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

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
    const newrestaurant = req.body;
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

    const errorMessage = validateRestaurant(newrestaurant);
    if (errorMessage !== "") {
      return handleError(res, 400, "Validation error: " + errorMessage);
    }

    let restaurant = await normalizeRestaurant(newrestaurant, userInfo._id);
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
