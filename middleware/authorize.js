const authenticate = require("./authenticated");
const user = require("../schemas/user");
require("./authenticated")
function authorize(req, res, next) {
    console.log(req.user);
    if(authenticate(req, res))
        if (req.user.role === "ADMIN") {
            next();
        } else {
            res.send({ error: "You are not authorized to do this action" });
        }
}

module.exports = authorize;
