const GoogleStrategy = require('passport-google-oauth20');
const User = require("../schemas/user");

module.exports = (passport) => {

    passport.use(new GoogleStrategy({
        clientID: '279090849146-v7skfq9of9bo42ttboei1qtng71ob1o1.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3030/oauth/google/redirect',
        scope: [ 'profile', 'email' ],
        state: true
    },
    async function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        const user = await User.findOne({googleId: profile.id}).catch(err => cb(err));
        if (user) {
            done(null, user);
        }else {
            const newUser = new User({
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,                
                email: profile._json.email,
                googleId: profile.id,
                userImage: profile._json.picture});
            const result = await newUser.save()
            done(null, result);
        }
    }
    ));
    //serialize user
    passport.serializeUser((user,done)=>done(null,user.id))

    //deserialize user
    passport.deserializeUser(async (id,done)=>{
        const user = await User.findById(id) 
        done(null,user);
    })
}