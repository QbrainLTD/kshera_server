const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "https://cardprojectidanarbelisite.onrender.com",
    "http://localhost:5173",
    "https://card-server.onrender.com",
  ],
});

module.exports = corsMiddleware;
