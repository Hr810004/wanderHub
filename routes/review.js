const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync.js')
const Review = require('../Models/reviews.js')
const Listing = require('../Models/listing.js')
const {validateReviews} = require('../middleware.js')


//post review
router.post('/' ,validateReviews, wrapAsync(async(req, res) =>{
    let listings = await Listing.findById(req.params.id)
    let newreview = new Review(req.body.review)

    listings.reviews.push(newreview)

    await newreview.save()
    await listings.save()
    res.redirect(`/listings/${listings._id}`)
}))

//delte review
router.delete('/:reviewid', wrapAsync(async(req, res) => {
    let {id, reviewid} = req.params
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/listings/${id}`)
}))

module.exports = router