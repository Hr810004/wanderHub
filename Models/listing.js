const mongoose = require('mongoose')
const Schema = mongoose.Schema  

const categories = ['All', 'Beach', 'Mountain', 'City', 'Countryside', 'Forest', 'Lake', 'Island', 'Desert', 'Safari'];

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: 'untitled listing'
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: categories,
        default: 'All'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

// Create and export the model
const Listing = mongoose.model('Listing', listingSchema)

// Export both the model and categories
module.exports = {
    Listing,
    categories
}