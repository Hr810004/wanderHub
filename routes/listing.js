const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')
const Listing = require('../Models/listing.js')

const listingController = require('../controller/listings.js')
const { route } = require('./user.js')

router
    .route('/')
    .get(wrapAsync(listingController.index))                            //Index route
    .post(validateListing, wrapAsync(listingController.createListing)) //Create route


//New route
router.get('/new', isLoggedIn, listingController.renderNewForm)


router
    .route('/:id')
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))  //Update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))                //Delete route
    .get(wrapAsync(listingController.showListing))                                          //Show route


//Edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;