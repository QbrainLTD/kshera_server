const express = require("express");
const cardsRouterController = require("../cards/routes/cardsRestController");
const usersRouterController = require("../users/routes/usersRestController");
const { handleError } = require("../utils/handleErrors");

const router = express.Router();

router.use("/cards", cardsRouterController);
router.use("/users", usersRouterController);

router.use((req, res) => {
  return handleError(res, 404, "Path not found");
});

module.exports = router;
