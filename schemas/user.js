const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String },
    username: { type: String,  unique: true },
    password: { type: String },
    role: { type: String },
    description: { type: String },
    email:{ type: String, unique: true},
    googleId: {type:String, unique: true}
});

module.exports = mongoose.model("user", schema);