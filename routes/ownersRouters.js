// routes/ownersRouters.js
const express = require('express');
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const userModel = require("../models/usermodel");

// Admin Dashboard — Create Product Page
router.get('/admin', isAdmin, (req, res) => {
    let success = req.flash("success");
    res.render("createProduct", { success });
});

// Manage Users Page
router.get('/users', isAdmin, async (req, res) => {
    try {
        let users = await userModel.find().select("-password");
        let success = req.flash("success");
        res.render("manageUsers", { users, success });
    } catch (err) {
        res.status(500).send("Error loading users");
    }
});

// Promote user to admin
router.post('/promote/:userid', isAdmin, async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.params.userid, { role: "admin" });
        req.flash("success", "User promoted to admin!");
        res.redirect("/owners/users");
    } catch (err) {
        req.flash("error", "Could not promote user.");
        res.redirect("/owners/users");
    }
});

// Demote admin to user
router.post('/demote/:userid', isAdmin, async (req, res) => {
    try {
        if (req.params.userid === req.user._id.toString()) {
            req.flash("error", "You cannot demote yourself!");
            return res.redirect("/owners/users");
        }
        await userModel.findByIdAndUpdate(req.params.userid, { role: "user" });
        req.flash("success", "Admin demoted to user.");
        res.redirect("/owners/users");
    } catch (err) {
        req.flash("error", "Could not demote user.");
        res.redirect("/owners/users");
    }
});

module.exports = router;