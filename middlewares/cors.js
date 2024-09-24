const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "http://127.0.0.1:5500",
    "www.tzachCards.co.il",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
});

module.exports = corsMiddleware;
