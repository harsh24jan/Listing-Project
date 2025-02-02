const User=require("../model/user.js");

module.exports.createSignup=(req,res)=>{
    res.render("listing/signup.ejs");
 };

 module.exports.postSignup=async (req,res)=>{
   try{
    let {username,email,password}=req.body;
    const newuser=new User({email,username});
    const registeredUser= await User.register(newuser,password);
    
    req.login(registeredUser,(err)=>{  // method in passport when we singup automatically we login
     
   if(err) {
       next(err);
     }
   req.flash("success","Welcome to WanderLust");
   res.redirect("/listing");
    })
    
    
   }
 
   catch(e){
    req.flash("deletemsg",e.message);
    res.redirect("/signup");
   }
 
 };

 module.exports.getLogin=(req,res)=>{
    res.render("listing/login.ejs")
  };

  module.exports.postLogin=async (req, res) => {
    req.flash("success", "Welcome Back to WanderLust");
 let redirectUrl=res.locals.redirectUrl ||"/listing";
 res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{    //passport ka hi method h
      if(err){
        next(err);
      }
      req.flash("success","You are Logged out!");
      res.redirect("/listing")
    })
  };