const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')
const { Listing } = require('../Models/listing.js')
const multer = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({storage})

const listingController = require('../controller/listings.js')
const { route } = require('./user.js')

router
    .route('/')
    .get(wrapAsync(listingController.index))                                                                       //Index route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)) //Create route


//New route
router.get('/new', isLoggedIn, listingController.renderNewForm)


router
    .route('/:id')
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))  //Update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))                //Delete route
    .get(isLoggedIn, wrapAsync(listingController.showListing))                                          //Show route


//Edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


module.exports = router;