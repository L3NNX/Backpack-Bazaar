const express=require('express');
const isLoggedin = require("../middleware/isLoggedIn"); 
const router= express.Router();

router.get('/',(req,res)=>{
    let error = req.flash('error');
    res.render('index', {error});
}); 

router.get("/shop", isLoggedin,function(req,res,next){
    res.render('shop', { user: req.user });
});

router.get("/logout", isLoggedin,function(req,res,next){
    res.render('shop');
});

module.exports = router;

