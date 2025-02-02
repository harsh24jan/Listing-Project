const listing=require("../model/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken});



module.exports.index=async (req, res, next) => {
    const allListing = await listing.find({});
   
    res.render("listing/index.ejs", { allListing });
  };

module.exports.newListing=(req, res) => {


     if(!req.isAuthenticated())
     {
      req.session.redirectUrl = req.originalUrl; 
      req.flash("deletemsg","You must be logged in to create listing");
      return res.redirect("/login");
     }

    res.render("listing/new.ejs");
  };

  module.exports.create=async (req, res, next) => {
    
   let response=await geocodingClient.forwardGeocode({
      query:req.body.location,
      limit: 1
    })
      .send()
     
  
   
    let url=req.file.path;
    let filename=req.file.filename;
    const { title, description, image, price, location, country } = req.body;

    const newListing = new listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
   newListing.owner=req.user._id;
   newListing.image={url,filename};
   newListing.geometry=response.body.features[0].geometry;
    let save1=await newListing.save();
    console.log(save1);
    req.flash("success","New Listing is Created!")
    res.redirect("/listing");
  }

  module.exports.showListing=async (req, res, next) => {
    let { id } = req.params;

    let showListing = await listing.findById(id).populate({path:"reviews",populate:{
   path:"author",
   select: "username",
    },
  }).populate("owner");
       
      if(!showListing)
      {
        req.flash("deletemsg"," Listing Doesnot Exist!")
        res.redirect("/listing");
      }

       
    res.render("listing/show.ejs", { showListing });
  };

  module.exports.editListing=async (req, res, next) => {
    if(!req.isAuthenticated())
      {
        req.session.redirectUrl = req.originalUrl; // Save the URL user tried to access
       req.flash("deletemsg","You must be logged in to create listing");
       res.redirect("/login");
      }
    let { id } = req.params;

    let listings = await listing.findById(id);

    if(!listings)
      {
        req.flash("deletemsg"," Listing  Doesnot  Exist!")
        res.redirect("/listing");
      }
      let originalUrl = listings.image.url.replace(
        "/upload/",
        "/upload/h_300,w_250/"
    );
    // console.log(originalUrl); // Check if transformation applied correctly
     
    res.render("listing/edit.ejs", { listings,originalUrl });
  };


  module.exports.updateListing=async (req, res, next) => {
    if(!req.isAuthenticated())
      {
       req.flash("deletemsg","You must be logged in to create listing");
       res.redirect("/login");
      }
   
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
     
  
    let updated = await listing.findByIdAndUpdate(id, {
      title: title,
      description: description,
      image: image,
      price: price,
      location: location,
      country: country,
    });

    if(typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
  
      updated.image={url,filename};
      await updated.save();
    }

    
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
  };

  module.exports.deleteListing=async (req, res, next) => {
    if(!req.isAuthenticated())
      {
        // req.session.redirectUrl = req.originalUrl; // Save the URL user tried to access

       req.flash("deletemsg","You must be logged in to create listing");
       res.redirect("/login");
      }
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("deletemsg"," Listing is Deleted!")
    res.redirect("/listing");
  };