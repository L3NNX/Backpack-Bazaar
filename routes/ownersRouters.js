const express = require('express');
const router = express.Router();
const ownerModel = require("../models/ownermodel");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async function (req, res) {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.send("You do not have permission to create another owner.");
        }
        let { fullname, email, password } = req.body;
        let createdOwner = await ownerModel.create({ fullname, email, password });
        res.send(createdOwner);
    });
}

router.get('/admin', (req, res) => {
    let success = req.flash("success");
    res.render("createProduct", { success });
});

module.exports = router;