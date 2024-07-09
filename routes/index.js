const express=require('express');
const isLoggedin = require("../middleware/isLoggedIn"); 

const router= express.Router();

router.get('/',(req,res)=>{
    res.render('index');
}); 

// router.post('/login', (req, res) => {
//     // Perform login logic
//     if (error) {
//       res.render('login', { error: error.message });
//     } else {
//       res.redirect('/shop');
//     }
//   });

router.get("/shop", isLoggedin,function(req,res,next){
    res.render('shop', { user: req.user });
});
module.exports = router;

