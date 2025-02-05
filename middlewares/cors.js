const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "https://kshera.onrender.com",
    "http://localhost:5173",
    "https://kshera-server.onrender.com",
    "https://kshera.com"
  ],
});

module.exports = corsMiddleware;
