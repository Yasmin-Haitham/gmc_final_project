const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    title : {type: String},
    description : {type: String},
    InputURL : {type: String},
    type: {type: String}
});

module.exports = mongoose.model("artical", schema);