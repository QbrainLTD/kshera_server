const express = require("express");
const restaurantsRouterController = require("../restaurants/routes/restaurantsRestController");
const usersRouterController = require("../users/routes/usersRestController");
const { handleError } = require("../utils/handleErrors");

const router = express.Router();

router.use("/restaurant", restaurantsRouterController);  
router.use("/users", usersRouterController); 

router.use((req, res) => {
  return handleError(res, 404, "Path not found");
});

module.exports = router;
