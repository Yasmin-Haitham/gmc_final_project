require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

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

app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize())
app.use(passport.session())

//body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use('/user',userRouter);
app.listen(port,()=>{console.log(`this server is up and running on: ${port}`)})