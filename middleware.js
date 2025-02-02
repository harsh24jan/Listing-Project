const listing=require("./model/listing")
const expressError = require("./utilis/expressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const review = require("./model/review.js");  // Ensure this points to the correct model file


module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl  ||"/listing"; // Use consistent naming

    } 
    
    next();
};

module.exports.isOwner=async (req,res,next)=>{
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
     let Listing=await listing.findById(id);
     if (!res.locals.currUser || !Listing.owner._id.equals(res.locals.currUser._id)) {
      req.flash("deletemsg", "You Are not Owner of the Listing");
      return res.redirect(`/listing/${id}`);
  }
  next();

}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(", ");
      throw new expressError(400, msg);
    }
    next();
  };

  module.exports.validateReview = (req, res, next) => {
      const { error } = reviewSchema.validate(req.body);
      if (error) {
        // Extract error messages and join them into a single string
        const msg = error.details.map((el) => el.message).join(", ");
        throw new expressError(400, msg);
      }
      next();
    };
  
    module.exports.isAuthor = async (req, res, next) => {
        let { id, reviewId } = req.params;
    
        // Fetch the review and populate the 'author' field
        let reviewDoc = await review.findById(reviewId).populate('author');
    
        // Check if the review exists
        if (!reviewDoc) {
            req.flash("deletemsg", "Review not found");
            return res.redirect(`/listing/${id}`);
        }
    
        
        if (!reviewDoc.author._id.equals(res.locals.currUser._id)) {
            req.flash("deletemsg", "You did not create this review");
            return res.redirect(`/listing/${id}`);
        }
        next();
    };
    