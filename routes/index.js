const express=require('express');
const isLoggedin = require("../middleware/isLoggedIn"); 
const router= express.Router();
const productModel = require("../models/productmodel")
const userModel = require("../models/usermodel")

router.get('/',(req,res)=>{
    let error = req.flash('error');
    res.render('index', {error});
}); 

router.get("/shop", isLoggedin, async function (req, res, next) {
    try {
        let success = req.flash("success");
        let products = await productModel.find({});
        res.render('shop', { products, success });
    } catch (err) {
        next(err);
    }
});

router.get("/addtocart/:productid", isLoggedin, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        user.cart.push(req.params.productid);
        await user.save();
        req.flash("success", "Product added to cart!");
        res.redirect("/shop");
    } catch (err) {
        req.flash("error", "Could not add product to cart.");
        res.redirect("/shop");
    }
});

router.get('/cart', isLoggedin, async (req, res, next) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart");
        let bill = user.cart.reduce((total, product) => {
            let price = product.price || 0;
            let discount = product.discount || 0;
            return total + price - (price * discount / 100);
        }, 0);
        res.render('cart', { products: user.cart, bill: Math.round(bill) });
    } catch (err) {
        next(err);
    }
});

router.get("/logout", isLoggedin, function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
});


module.exports = router;

