const Joi = require("joi");

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // Validate HH:MM format

const validateRestaurantWithJoi = (restaurant) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    rating: Joi.number().min(0).max(10),
    status: Joi.string().valid("פתוח", "סגור"),
    kosher: Joi.boolean(),
    tags: Joi.array().items(Joi.string().min(2).max(50)),
    description: Joi.string().min(2).max(1024).required(),
    imageUrl: Joi.string().regex(urlRegex).message('restaurant "imageUrl" must be a valid URL').required(),
    openingHours: Joi.object({
      from: Joi.string().pattern(timeRegex).required().messages({ "string.pattern.base": "Opening time must be in HH:MM format" }),
      to: Joi.string().pattern(timeRegex).required().messages({ "string.pattern.base": "Closing time must be in HH:MM format" }),
    }).required(),
  });

  return schema.validate(restaurant);
};

module.exports = validateRestaurantWithJoi;

