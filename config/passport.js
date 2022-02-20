const LocalStrategy = require("passport-local").Strategy;
const User = require("../schemas/user");
const bcrypt = require("bcrypt");

//implement strategy 
const Strategy = (passport) =>{
    passport.use(new LocalStrategy(
        async(username,password,done)=>{
            /*verify fuction returns cb done where 
            where done has 2 parametres 
            (err|| null , false||user)
            first user.findOne and catch error of actual database ex: database faliure to connect 
            return done(e)
            if user not found (null,false)
            if user found check password if matched (null, user)
            else (null, false)*/
            const user = await User.findOne({username}).catch((e)=>done(e));
            if (!user){
                done(null,false);
            }
            else{
                bcrypt.compare(password,user.password,(err,result)=>{
                    if(result)
                        done(null,user);
                    else
                        done(null,false);
                })
            }
        }
    ))

    //serialize user
    passport.serializeUser((user,done)=>done(null,user.id))//could it be anything other than id?

    //deserialize user
    passport.deserializeUser(async(id,done)=>{
        const user = await User.findById(id) //why didn't i check for user msh momkn yeb2a 7asl error fa mayb2ash mawgod fi el session
        done(null,user);
    })
}