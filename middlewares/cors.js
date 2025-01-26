const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "https://restaurantprojectidanarbelisite.onrender.com",
    "http://localhost:5173",
    "https://restaurant-server.onrender.com",
  ],
});

module.exports = corsMiddleware;
