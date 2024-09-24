const express = require("express");
const {
  createCard,
  getCards,
  getCard,
  getMyCards,
  updateCard,
  deleteCard,
  likeCard,
} = require("../models/cardsAccessDataService");
const auth = require("../../auth/authService");
const { normalizeCard } = require("../helpers/normalizeCard");
const { handleError } = require("../../utils/handleErrors");
const validateCard = require("../validation/cardValidationService");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      return handleError(res, 403, "Only business user can create new card");
    }

    const errorMessage = validateCard(req.body);
    if (errorMessage !== "") {
      return handleError(res, 400, "Validation error: " + errorMessage);
    }

    let card = await normalizeCard(req.body, userInfo._id);
    card = await createCard(card);
    res.status(201).send(card);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    let cards = await getCards();
    res.send(cards);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      return handleError(res, 403, "Only business user can get my card");
    }
    let card = await getMyCards(userInfo._id);
    res.send(card);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let card = await getCard(id);
    res.send(card);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const newCard = req.body;
    const { id } = req.params;
    const fullCardFromDb = await getCard(id);
    if (
      userInfo._id !== fullCardFromDb.user_id.toString() &&
      !userInfo.isAdmin
    ) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the user who created the business card or admin can update its details"
      );
    }

    const errorMessage = validateCard(newCard);
    if (errorMessage !== "") {
      return handleError(res, 400, "Validation error: " + errorMessage);
    }

    let card = await normalizeCard(newCard, userInfo._id);
    card = await updateCard(id, card);
    res.send(card);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;
    const fullCardFromDb = await getCard(id);
    if (
      userInfo._id !== fullCardFromDb.user_id.toString() &&
      !userInfo.isAdmin
    ) {
      return handleError(
        res,
        403,
        "Authorization Error: Only the user who created the business card or admin can delete this card"
      );
    }

    let card = await deleteCard(id);
    res.send(card);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    let card = await likeCard(id, userId);
    res.send(card);
  } catch (error) {
    handleError(res, error.status || 400, error.message);
  }
});

module.exports = router;
