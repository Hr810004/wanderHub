const { Listing } = require('./Models/listing.js')
const Review  = require('./Models/reviews.js')
const {listingSchema, reviewSchema} = require('./schema.js')
const ExpressError = require('./utils/ExpressError.js')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("here is the issue")
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectURL = req.originalUrl
        req.flash('error', 'Login Required!')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectURL = (req, res, next) => {
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error', 'You dont have permission to edit')
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewid} = req.params
    let review = await Review.findById(reviewid)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not author of this review')
        return res.redirect(`/listings/${id}`)
    }

    next()
}

//validate listings
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMsg)
    }else{
        next()
    }
}

//validate reviews
module.exports.validateReviews = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, result.error)
    }else{
        next()
    }
}