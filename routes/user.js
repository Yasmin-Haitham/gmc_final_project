const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const passport = require("passport");
const joi = require("joi");
const bcrypt = require("bcrypt");
const artical = require("../schemas/articals")

router.get("/",async(req,res)=>{
    const articals = await artical.find({});
    res.render("homepage",{articals})
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
router.get("/update", async(req,res)=>{
    const user = req.user
    res.render("update",{user})
    
    //recheck for redundance 
})

router.put("/update", async (req,res)=>{
    const body = req.body
    const user = req.user
    console.log("we are here", body )
    const schema = joi.object({
        firstName: joi.string().empty(''),
        lastName: joi.string().empty(''),
        username: joi.string().empty('').alphanum().min(3).max(30),
        password: joi.string().empty(''),
        role: joi.string().empty(''),
        description: joi.string().empty('')
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        bcrypt.hash(body.password,10,async(err, hash)=>{
        body.password = hash;
        await User.findByIdAndUpdate(user.id,{
            firstName: body.firstName ,
            lastName: body.lastName,
            username: body.username,
            password: body.password,
            role: body.role,
            description:body.description
        }).then(() =>res.redirect("/")).catch((e)=>res.status(500).send(e));
              
        })
    }
})
router.post("/signup",async(req,res)=>{
    //first step is to assign the joi schema to check the req aganist 
    const body = req.body
    const schema = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        username: joi.string().alphanum().min(3).max(30).required(),
        email: joi.string().required(),
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
            email: body.email,
            username: body.username,
            password: body.password,
            role: body.role,
            description:body.description
        })
        //after parsing the body and creating a new user before adding to db password must be encrypted
        bcrypt.hash(newUser.password,10,async(err, hash)=>{
            newUser.password = hash;
            console.log(newUser)
            newUser.save().then(() => res.redirect("/login")).catch((e)=>res.status(500).send(e));
        })
    }

});

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{successRedirect: "/",failureRedirect: "/login"})
    (req,res,next)
})

router.put("/update",async(req,res)=>{
    //first step is to assign the joi schema to check the req aganist 
    const body = req.body
    const schema = joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
        username: joi.string().alphanum().min(3).max(30),
        password: joi.string(),
        role: joi.string(),
        description: joi.string()
    });
    const {error} = schema.validate(body);
    if(error)
        res.send(error);
    else{
        const update={
            firstName: body.firstName ,
            lastName: body.lastName,
            username: body.username,
            password: body.password,
            role: body.role,
            description:body.description
        }
        //after parsing the body and creating a new user before adding to db password must be encrypted
        bcrypt.hash(update.password,10,async(err, hash)=>{
            update.password = hash;
            const doc = await User.findOneAndUpdate(req.user, update).catch((e)=>res.status(500).send(e));
            res.redirect("/");
            
        })
    }

});


router.get('/oauth/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
