const mongoose = require('mongoose')
const Schema = mongoose.Schema  


const listningSchema = new Schema({
    title:{
        type : String,
        required : true,
        default : 'untitled listing'
    },
    description :String,
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1735707370784-9b3e8dd9e8b1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
        set: (v) => v===""
            ? "https://images.unsplash.com/photo-1735707370784-9b3e8dd9e8b1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            : v.url,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})


const Listing = mongoose.model('Listing', listningSchema)
module.exports = Listing