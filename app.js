if(process.env.NODE_ENV !="production"){
  require('dotenv').config();  //dotenv is package of npm to link env (environmental file ) to backend

}



const express = require("express");
const app = express();
const method = require("method-override");
const path = require("path");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const expressError = require("./utilis/expressError.js");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
 const port=8080;



const listRouter = require("./routes/listing.js");
const ReviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));
app.use(method("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname,"/public")))

const mongoose = require("mongoose");
const User = require("./model/user.js");
const { URLSearchParams } = require("url");

const dbUrl=process.env.ATLASDB_URL;

main()
  .then((r) => {
    console.log("connection");
  })

  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600

});

store.on("error",()=>{
  console.log("Error in Mogo SESSION STORE",err);
});

const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
  },
};
app.listen(port, () => {
  console.log("server is working");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { 
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.deleteMessage = req.flash("deletemsg");
  res.locals.currUser=req.user  // help to store the user information and helps us to show the signup login logout option according to need
    next();
});





app.use("/listing", listRouter);
app.use("/listing/:id/reviews", ReviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(new expressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let {
    status = 500, message = "mess not found"
  } = err;

  res.render("listing/error.ejs", { message });
});