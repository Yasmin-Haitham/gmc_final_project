const express = require("express");
const artical = require("../schemas/articals");
const router = express.Router();
const joi = require("joi");
const authenticated = require("../middleware/authenticated")



router.get("/",authenticated, async(req,res)=>{
    const{page = 1, genre = ""}= req.query 
    let filter = undefined
    if (genre !=""){
        filter={type: genre}
    }else{
        filter={}
    }
    const articals = await artical.find(filter).limit(2).skip(2*(page-1))
    
    const totalArticals = await artical.find(filter).count()
    console.log(req.query)
    console.log(filter)
    
    if ( req.user.role == "ADMIN")
        res.render("articals_admin", { 
            articals,
            totalPages: Math.ceil(totalArticals / 2),
            currentPage: page,
            genre: genre
             })
    else
        res.render("articals_user",{ articals,
            totalPages: Math.ceil(totalArticals / limit),
            currentPage: page  })})

router.get("/artical/add",(req,res)=>{ res.render("articalAdd")})

router.get("/artical/Edit/:id", async (req,res)=>{ 
    const id = req.params.id
    
    const Artical = await artical.findById(id);
    
    res.render("articalEdit",{Artical})})

router.get("/artical/Delete/:id", async (req,res)=>{
    const id = req.params.id
    await artical.findByIdAndDelete(id)
    res.redirect("/articals")
})
    
router.post("/artical/add",(req,res)=>{
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
        
        newArtical.save().then(()=>res.redirect("/"))
    }
})

router.put("/artical/Edit/:id",(req,res)=>{
    const body = req.body;
    const id = req.params.id;
    console.log(id)
    const schema = joi.object({
        title: joi.string().empty(""),
        description :joi.string().empty(""),
        InputURL : joi.string().empty(""),
        type: joi.string().empty("")    
    })
    const {error} = schema.validate(body);
    if(error){
        res.send(error)
    }else{

        artical.findByIdAndUpdate(id,{
            ...body
        }).then(()=>res.redirect("/")).catch((e)=>res.status(500).send(e));
    }
})



module.exports = router;