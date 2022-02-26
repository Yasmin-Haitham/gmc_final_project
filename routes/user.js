const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const passport = require("passport");
const joi = require("joi");
const bcrypt = require("bcrypt");

router.get("/",(req,res)=>{
    res.render("homepage")
})
router.get("/login",(req,res)=>{
    res.render("login")
})
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});
router.get("/signup",(req,res)=>{
    res.render("signup")
})
router.post("/signup",async(req,res)=>{
    //first step is to assign the joi schema to check the req aganist 
    const body = req.body
    const schema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        username: joi.string().alphanum().min(3).max(30).required(),
        password: joi.string().required(),
        role: joi.string(),
        description: joi.string()
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        const newUser = new User({
            firstName: body.firstName ,
            lastName: body.lastName,
            username: body.username,
            password: body.password,
            role: body.role,
            description:body.description
        });
        //after parsing the body and creating a new user before adding to db password must be encrypted
        bcrypt.hash(newUser.password,10,async(err, hash)=>{
            newUser.password = hash;
            const result = await newUser.save().catch((e)=>res.status(500).send(e));
            res.send(result);
             
        });
    }

});

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/login"
    })(req,res,next)
})

module.exports = router;
