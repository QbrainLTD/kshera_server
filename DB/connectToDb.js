const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Restaurant = require("../restaurants/models/mongodb/Restaurant");

require("dotenv").config();

const connectToDb = async () => {
    const useAtlas = process.env.USE_ATLAS === "true"; 
    const dbURI = useAtlas ? process.env.ATLAS_CONNECTION_STRING : "mongodb://127.0.0.1:27017/restaurantDB";

    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`✅ Connected to MongoDB (${useAtlas ? "Atlas" : "Local"})`);

        await loadDefaultRestaurants(); 
    } catch (error) {
        console.error("❌ Could not connect to MongoDB", error);
    }
};

const loadDefaultRestaurants = async () => {
    try {
        const count = await Restaurant.countDocuments();
        if (count === 0) {
            console.log("📌 No restaurants found. Loading default data...");

            const filePath = path.join(__dirname, "../data", "default_restaurants.json");
            if (!fs.existsSync(filePath)) {
                console.warn("⚠️ No default restaurants file found.");
                return;
            }

            const jsonData = fs.readFileSync(filePath, "utf-8");
            const restaurants = JSON.parse(jsonData);

            await Restaurant.insertMany(restaurants);
            console.log("✅ Default restaurants loaded successfully.");
        } else {
            console.log("✅ Restaurants already exist. Skipping default data load.");
        }
    } catch (error) {
        console.error("❌ Error loading default restaurants:", error);
    }
};

module.exports = connectToDb;
