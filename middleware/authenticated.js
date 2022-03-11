function authenticate(req, res, next) {
    if (req.user) {
        next(true);
    } else {
        res.redirect("/login");
    }
}
module.exports = authenticate;