const mongoose = require('mongoose')
const initdata = require('./data.js')
const { Listing } = require('../Models/listing.js')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb"
const dburl = process.env.ATLASDB_URL   

async function main() {
    try {
        await mongoose.connect(dburl, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to database");
        
        // Initialize the database after connection is established
        await initDb();
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database");
    }
}

const initDb = async () => {
    try {
        // Clear existing data
        const deleteResult = await Listing.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing listings`);

        const ownerId = process.env.DEFAULT_OWNER_ID || '68053af9676552b4fdafcf0e';
        const listingsWithOwner = initdata.data.map((obj) => ({
            ...obj,
            owner: ownerId
        }));

        // Insert new listings
        const insertResult = await Listing.insertMany(listingsWithOwner);
        console.log(`Successfully initialized ${insertResult.length} listings`);
    } catch (err) {
        console.error("Error initializing data:", err.message);
        throw err; 
    }
}

// Run the initialization
main().catch(err => {
    console.error("Fatal error during initialization:", err.message);
    process.exit(1);
});

