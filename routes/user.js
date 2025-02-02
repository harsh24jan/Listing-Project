const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const wrapAsync = require("../utilis/wrapAsync.js");
const passport = require("passport");
const flash = require("connect-flash");
const { savedRedirectUrl } = require("../middleware.js");
const {createSignup,postSignup, getLogin, postLogin, logout}=require("../controller/user.js")



router.route("/signup")
.get(createSignup)
.post(wrapAsync(postSignup));



router.route("/login")
.get(getLogin)
.post(
  savedRedirectUrl,
  passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true, // Enable flash messages for failure
  }),postLogin
  
);

router.get("/logout",logout)





module.exports=router;
