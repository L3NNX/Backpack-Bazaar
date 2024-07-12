const express=require('express');
const isLoggedin = require("../middleware/isLoggedIn"); 
const productmodel = require('../models/productmodel');
const router= express.Router();

router.get('/',(req,res)=>{
    let error = req.flash('error');
    res.render('index', {error});
}); 

router.get("/shop", isLoggedin,async function(req,res){
    let success=req.flash("success")
    let  products = await productmodel.find();
    res.render("shop", { products , success});
});

router.get("/logout", isLoggedin,function(req,res,next){
    res.render('shop');
});

module.exports = router;

