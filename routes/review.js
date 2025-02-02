const express=require("express");
const router=express.Router({mergeParams:true});
const { reviewSchema } = require("../schema.js");
const review = require("../model/review.js");
const wrapAsync = require("../utilis/wrapAsync.js");
const expressError = require("../utilis/expressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../model/listing.js");
const {validateReview}=require("../middleware.js");
const {isAuthor}=require("../middleware.js");
const {createReview,deleteReview}=require("../controller/review.js");




router.post(
    "/",
    validateReview,
    wrapAsync(createReview)
  );
  
  // delete review route
  
  router.delete(
    "/:reviewId",
    isAuthor,
    wrapAsync(deleteReview)
  );

  module.exports=router;