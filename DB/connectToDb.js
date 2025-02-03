const mongoose = require("mongoose");
require("dotenv").config();

const connectToAtlasDb = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB Atlas successfully");
    } catch (error) {
        console.error("❌ Could not connect to MongoDB Atlas", error);
        process.exit(1);
    }
};

module.exports = connectToAtlasDb;
