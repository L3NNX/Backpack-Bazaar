const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const userModel = require("../models/usermodel");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        let existing = await userModel.findOne({ email });
        if (existing) {
            req.flash("error", "User already exists. Please login.");
            return res.redirect("/");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let user = await userModel.create({ email, password: hash, fullname });
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");
    } catch (error) {
        console.error(error.message);
        req.flash("error", "Registration failed. Please try again.");
        res.redirect("/");
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "Account not found. Please signup first.");
            return res.redirect("/auth#signup");
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
             if (user.role === "admin") {
                res.redirect("/owners/admin");   // Admin → Admin Panel
            } else {
                res.redirect("/shop");           // User → Shop
            }
        } else {
            req.flash("error", "Invalid email or password.");
            res.redirect("/");
        }
    } catch (error) {
        console.error(error.message);
        req.flash("error", "Login failed. Please try again.");
        res.redirect("/");
    }
};

module.exports.logout = async function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
};