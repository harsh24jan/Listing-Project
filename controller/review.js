const review=require("../model/review.js");
const   listing=require("../model/listing.js");

module.exports.createReview=async (req, res) => {
    
    if(!req.isAuthenticated())
      {
       req.session.redirectUrl = req.originalUrl; 
       req.flash("deletemsg","You must be logged in to create listing");
       return res.redirect("/login");
      }
 
  let {id}=req.params;
    let Listing = await listing.findById(id);

    let { comment, rating } = req.body;
    const newReview = new review({
      comment: comment,
      rating: rating,
    });
    newReview.author=req.user._id;
    Listing.reviews.push(newReview);
    
    await newReview.save();
    await Listing.save();
    req.flash("success","New Review is Created!")
    res.redirect(`/listing/${id}`);
  };

  module.exports.deleteReview=async (req, res) => {

    if(!req.isAuthenticated())
      {
       req.session.redirectUrl = req.originalUrl; 
       req.flash("deletemsg","You must be logged in to delete review");
       return res.redirect("/login");
      }
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await review.findByIdAndDelete(reviewId);
    req.flash("deletemsg"," Review is Deleted!")
    res.redirect(`/listing/${id}`);
  };