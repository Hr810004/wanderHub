const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync.js')
const { Listing } = require('../Models/listing.js')
const { validateReviews, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const reviewController = require('../controller/reviews.js')


//post review
router.post('/' ,isLoggedIn, validateReviews, wrapAsync(reviewController.createReview))

//delte review
router.delete('/:reviewid',isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router