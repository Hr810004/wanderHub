const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js')
const Listing = require('../Models/listing.js')



//Index route
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render('./listings/index.ejs', {allListings})
}))

//Create route
router.post('/',validateListing, wrapAsync(async (req, res, next) => {
    let listing = req.body.listing
    const newlisting = new Listing(listing)
    newlisting.owner = req.user._id
    await newlisting.save()
    req.flash('success', 'Listing Added successfully')
    res.redirect('/listings')
}))

//New route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('./listings/new.ejs')
})

//Edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params
    const list =await Listing.findById(id)
    res.render('./listings/edit.ejs',{list})
}))

//Update route
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params
   
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash('success', 'Listing Updated Successfully')
    res.redirect(`/listings/${id}`)
}))

//Delete route
router.delete('/:id', isLoggedIn, isOwner, wrapAsync( async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id,{...req.body.listing})
    req.flash('success', 'Listing Deleted Successfully')
    res.redirect('/listings')
}))

//Show route
router.get('/:id', wrapAsync(async (req, res) => {
    let {id} = req.params
    const list =await Listing.findById(id).populate("reviews").populate("owner")
    if(!list){
        req.flash('error', 'Listing does not exist!')
        res.redirect('./listings')
    }
    res.render('./listings/show.ejs', { list})
}))


module.exports = router;