const express = require("express");
const artical = require("../schemas/articals");
const router = express.Router();
const joi = require("joi");



router.get("/articals",async(req,res)=>{ 
    const articals = await artical.find({});
    if ( req.user.role == "ADMIN")
        res.render("articals_admin", { articals })
    else
        res.render("articals_user",{ articals })})
router.get("/articals/add",(req,res)=>{ res.render("articalAdd")})
router.get("/artical/edit/:id", async (req,res)=>{ 
    const id = req.params.id
    const Artical = await artical.findById(id);
    res.render("articalEdit",{Artical})})
    
router.post("/articals/add",(req,res)=>{
    const body = req.body;
    const schema = joi.object({
        title: joi.string(),
        description :joi.string(),
        InputURL : joi.string(),
        type: joi.string()    
    })
    const {error} = schema.validate(body);
    if(error){
        res.send(error)
    }else{
        const newArtical = new artical({
            title: body.title,
            description: body.description,
            InputURL:body.InputURL,
            type: body.type
        })
        console.log(newArtical)
        newArtical.save().then(()=>res.redirect("/articals"))
    }
})

router.post("/artical/edit/:id",(req,res)=>{

})



module.exports = router;