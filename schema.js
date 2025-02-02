const Joi = require('joi');


const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().allow('', null),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required()
});

module.exports = { listingSchema };

module.exports.reviewSchema=Joi.object({

  rating:Joi.number().required().min(1).max(5),
  comment:Joi.string().required(),

});

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      // Extract error messages and join them into a single string
      const msg = error.details.map((el) => el.message).join(", ");
      throw new expressError(400, msg);
    }
    next();
  };
