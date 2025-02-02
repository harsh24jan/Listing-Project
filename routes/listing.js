const express=require("express");
const router=express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const expressError = require("../utilis/expressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../model/listing.js");
const { isOwner,validateListing } = require("../middleware.js");
const { index,create, newListing, showListing, editListing, updateListing,deleteListing} = require("../controller/listing.js");
const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})


// index route,create route
router
.route("/")
.get(
  wrapAsync(index)
)
.post(
 
  upload.single("image"),
  validateListing,
  wrapAsync(create)
);


  
  // new route
  router.get("/new",newListing);

  // show route,update route
  router.route("/:id").get(
    wrapAsync(showListing))
    .put(
      isOwner, upload.single("image"),
      validateListing,
      wrapAsync(updateListing)
    );
  
  // edit route
  
  router.get(
    "/:id/edit",isOwner,
    wrapAsync(editListing)
  );  
  // delete
  
  router.delete(
    "/:id/delete",isOwner,
    wrapAsync(deleteListing)
  );


  module.exports=router;