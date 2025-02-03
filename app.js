const express = require("express");
const chalk = require("chalk");
require("dotenv").config();
const connectToDb = require("./DB/connectToDb"); 
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { handleError } = require("./utils/handleErrors");
const loggerMiddleware = require("./logger/loggerService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(express.json());
app.use(loggerMiddleware());
app.use(express.static("./public"));
app.use(router);

app.use((err, req, res, next) => {
  const message = err || "Internal server error";
  return handleError(res, 500, message);
});

app.listen(PORT, async () => {
  console.log(chalk.yellow(`🚀 Server running on port ${PORT}`));
  await connectToDb(); // ✅ Connect to DB & Load Default Restaurants
});
