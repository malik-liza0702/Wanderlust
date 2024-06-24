const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/Listing.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,result.errMsg);

    }
    else{
        next();
    }
}

// Reviews
// Post review route
router.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    console.log("params id",req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`)
}));


// delete review route
router.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))
module.exports=router;