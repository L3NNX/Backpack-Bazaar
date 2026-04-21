const express=require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {registerUser , loginUser , logout}=require('../controllers/authController');

// ── RATE LIMITER ──
// Applies only to login and register — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        req.flash("error", "Too many attempts. Please try again in 15 minutes.");
        res.redirect("/auth");
    }
});
 

router.get('/',(req,res)=>{
    res.send("Welcome");
}); 

router.post('/register', authLimiter, registerUser);

router.post('/login', authLimiter, loginUser);

router.get('/logout', logout);

module.exports = router;