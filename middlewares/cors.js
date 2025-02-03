const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "https://kshera.onrender.com",
    "http://localhost:5173",
    "https://kshera-server.onrender.com",
  ],
});

module.exports = corsMiddleware;
