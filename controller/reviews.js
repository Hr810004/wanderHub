const Review = require('../Models/reviews.js')
const Listing = require('../Models/listing.js')

module.exports.createReview = async(req, res) =>{
    let listings = await Listing.findById(req.params.id)
    let newreview = new Review(req.body.review)
    newreview.author = req.user._id
    listings.reviews.push(newreview)

    await newreview.save()
    await listings.save()
    res.redirect(`/listings/${listings._id}`)
}

module.exports.deleteReview = async(req, res) => {
    let {id, reviewid} = req.params
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/listings/${id}`)
}