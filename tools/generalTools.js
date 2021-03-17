exports.loginChecker = (req, res, next) => {
    if(!req.session.user)
        return next();
    res.redirect("/dashboard");
}
exports.accessControl = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect(303, `/login`);
}