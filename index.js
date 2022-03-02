require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

require("./config/passport")(passport);
require("./config/google-passport")(passport);
//start app
const app = express();

//set port
const port = 3030

//set view engine
app.set('view engine', 'pug')

//set router
const userRouter = require('./routes/user');

//connect the database
mongoose.connect(
    process.env.CONNECTION_STRING,
    {},
    () => console.log("Connected to DB")
);
//passport init

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.session())

//body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/",(req,res,next)=>{
    res.locals.user=req.user
    next();
})

//routes
app.use('/',userRouter);

app.listen(port,()=>{console.log(`this server is up and running on: ${port}`)})