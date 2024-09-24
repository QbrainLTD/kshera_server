const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "http://3.75.158.163",
    "http://3.125.183.140",
    "http://35.157.117.28",
    "http://localhost:5173",
  ],
});

module.exports = corsMiddleware;
