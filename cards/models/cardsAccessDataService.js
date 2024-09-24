const { createError } = require("../../utils/handleErrors");
const Card = require("./mongodb/Card");

const config = require("config");
const DB = config.get("DB");

const createCard = async (newCard) => {
  if (DB === "mongodb") {
    try {
      let card = new Card(newCard);
      card = await card.save();
      return card;
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  const error = new Error("there is no other db for this requests");
  error.status = 500;
  return createError("DB", error);
};

const getCards = async () => {
  try {
    let cards = await Card.find();
    return cards;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const getCard = async (cardId) => {
  try {
    let card = await Card.findById(cardId);
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const getMyCards = async (userId) => {
  try {
    let cards = await Card.find({ user_id: userId });
    return cards;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const updateCard = async (cardId, newCard) => {
  try {
    let card = await Card.findByIdAndUpdate(cardId, newCard, { new: true });
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const deleteCard = async (cardId) => {
  try {
    let card = await Card.findByIdAndDelete(cardId);
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

const likeCard = async (cardId, userId) => {
  try {
    let card = await Card.findById(cardId);
    if (!card) {
      const error = new Error(
        "A card with this ID cannot be found in the database"
      );
      error.status = 404;
      return createError("Mongoose", error);
    }
    if (card.likes.includes(userId)) {
      let newLikesArray = card.likes.filter((id) => id != userId);
      card.likes = newLikesArray;
    } else {
      card.likes.push(userId);
    }
    await card.save();
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

module.exports = {
  createCard,
  getCards,
  getCard,
  getMyCards,
  updateCard,
  deleteCard,
  likeCard,
};
