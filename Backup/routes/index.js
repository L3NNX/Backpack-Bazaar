const express=require('express');
const isLoggedin = require("../middleware/isLoggedIn"); 
const router= express.Router();
const productModel = require("../models/productmodel")
const userModel = require("../models/usermodel")

router.get('/',(req,res)=>{
    let error = req.flash('error');
    res.render('index', {error});
}); 

router.get("/shop", isLoggedin,async function(req,res,next){
    let success= req.flash("success")
    let products = await productModel.find({});
    // console.log(products)
    res.render('shop', { products, success });
});

router.get("/addtoCart/:productid", isLoggedin,async function(req,res){
    let user = await userModel.findOne({email : req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
})

router.get("/cart", isLoggedin, async (req, res)=> {
    let user=await userModel
    .findOne({email:req.user.email})
    .populate("cart");
    
    let products = await productModel.find({});
   res.render('cart',{products,user})
   
  });

router.get("/logout", isLoggedin,function(req,res,next){
    res.render('shop');
});

module.exports = router;

