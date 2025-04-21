const Listing = require("../Models/listing.js")

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({})
  res.render("./listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render('./listings/new.ejs')
}

module.exports.createListing = async (req, res, next) => {
    let listing = req.body.listing
    const newlisting = new Listing(listing)
    newlisting.owner = req.user._id
    await newlisting.save()
    req.flash('success', 'Listing Added successfully')
    res.redirect('/listings')
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params
    const list =await Listing.findById(id)
    res.render('./listings/edit.ejs',{list})
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params
   
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash('success', 'Listing Updated Successfully')
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing =  async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id,{...req.body.listing})
    req.flash('success', 'Listing Deleted Successfully')
    res.redirect('/listings')
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params
    const list =await Listing.findById(id).populate({path : "reviews", populate : { path : "author",},}).populate("owner")
    if(!list){
        req.flash('error', 'Listing does not exist!')
        res.redirect('./listings')
    }
    res.render('./listings/show.ejs', { list})
}
