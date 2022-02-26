function authorize(req, res, next) {
    console.log(req.user.role);
    if (req.user.role === "ADMIN") {
        next();
    } else {
        res.send({ error: "You are not authorized to do this action" });
    }
}

module.exports = authorize;
