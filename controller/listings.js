const { Listing, categories } = require("../Models/listing.js")

module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
        query.category = category;
    }

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }
    
    const allListings = await Listing.find(query);
    res.render("./listings/index.ejs", { 
        allListings, 
        categories, 
        selectedCategory: category || 'All',
        search: search || '' 
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('./listings/new.ejs')
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename

    let listing = req.body.listing
    const newlisting = new Listing(listing)
    newlisting.owner = req.user._id
    newlisting.image = {url, filename}
    await newlisting.save()
    req.flash('success', 'Listing Added successfully')
    res.redirect('/listings')
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params
    const list =await Listing.findById(id)
    if(!list){
        req.flash('error',"Listing does not exist")
        res.redirect('/listings')
    }

    let originalImageUrl = list.image.url
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250')
    res.render('./listings/edit.ejs',{list, originalImageUrl})
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if(typeof req.file !== 'undefined'){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
        await listing.save()
    }
   
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
