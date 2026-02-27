// middleware/isAdmin.js
const jwt = require("jsonwebtoken");
const userModel = require("../models/usermodel");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("error", "You need to login first");
        return res.redirect("/auth");
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/auth");
        }

        if (user.role !== "admin") {
            req.flash("error", "Access denied. Admins only.");
            return res.redirect("/shop");
        }

        req.user = user;
        next();
    } catch (err) {
        req.flash("error", "You need to login first");
        res.redirect("/auth");
    }
};