const express=require('express');
const isLoggedin = require("../middleware/isLoggedIn"); 
const router= express.Router();
const productModel = require("../models/productmodel")
const userModel = require("../models/usermodel")
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

router.get('/', async (req, res) => {
    try {
        let adminExists = await userModel.findOne({ role: "admin" });
        res.render('index', { needsSetup: !adminExists });
    } catch (err) {
        res.render('index', { needsSetup: false });
    }
})

router.get('/auth', (req, res) => {
    // let error = req.flash('error');
    // res.render('auth', { error });
        res.render('auth');
});

// Show setup page
router.get('/setup', async (req, res) => {
    try {
        let adminExists = await userModel.findOne({ role: "admin" });
        if (adminExists) {
            return res.render('setup', { alreadySetup: true });
        }
        res.render('setup', { alreadySetup: false });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Create first admin
router.post('/setup', async (req, res) => {
    try {
        // Block if admin already exists
        let adminExists = await userModel.findOne({ role: "admin" });
        if (adminExists) {
            return res.render('setup', { alreadySetup: true });
        }

        let { secretKey, fullname, email, password } = req.body;

        // Verify secret key from .env
        if (secretKey !== process.env.SETUP_SECRET) {
            req.flash("error", "Invalid secret key.");
            return res.redirect("/setup");
        }

        // Check duplicate email
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            req.flash("error", "This email is already registered.");
            return res.redirect("/setup");
        }

        // Create admin account
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        let admin = await userModel.create({
            fullname,
            email,
            password: hash,
            role: "admin"           // ← This makes them admin
        });

        // Auto login
        let token = generateToken(admin);
        res.cookie("token", token);

        req.flash("success", "Admin account created! Welcome to Jhola.");
        res.redirect("/owners/admin");

    } catch (err) {
        console.error(err.message);
        req.flash("error", "Something went wrong. Try again.");
        res.redirect("/setup");
    }
});


router.get("/shop", isLoggedin, async function (req, res, next) {
    try {
        let success = req.flash("success");
        let { search, sortby, category } = req.query;

        let filter = {};

        if (search && search.trim() !== '') {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        if (category && category !== 'all') {
            if (category === 'discounted') {
                filter.discount = { $gt: 0 };
            } else {
                filter.category = category;
            }
        }

  
        let sort = { createdAt: -1 }; 
        switch (sortby) {
            case 'newest':     sort = { createdAt: -1 };  break;
            case 'price_asc':  sort = { price: 1 };       break;
            case 'price_desc': sort = { price: -1 };      break;
            case 'popular':    sort = { createdAt: -1 };   break;
        }

        let products = await productModel.find(filter).sort(sort);

        res.render('shop', {
            products,
            success,
            search: search || '',
            sortby: sortby || 'popular',
            category: category || 'all'
        });
    } catch (err) {
        next(err);
    }
});

// Add to index.js
router.get("/product/:id", isLoggedin, async function (req, res) {
    try {
        let product = await productModel.findById(req.params.id);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/shop");
        }
        
        // Get related products (same category, exclude current)
        let related = await productModel.find({ 
            category: product.category, 
            _id: { $ne: product._id } 
        }).limit(4);
        
        res.render('productDetail', { product, related });
    } catch (err) {
        res.redirect("/shop");
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
         let products = user.cart || [];
        let bill =  products.reduce((total, product) => {
            let price = product.price || 0;
            let discount = product.discount || 0;
            return total + price - (price * discount / 100);
        }, 0);
         let success = req.flash("success"); 
            res.render('cart', { 
            products, 
            bill: Math.round(bill),
            success    
        });
    } catch (err) {
        next(err);
    }
});

router.get('/removefromcart/:productid', isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        // Find and remove one instance of the product
        let index = user.cart.indexOf(req.params.productid);
        if (index !== -1) {
            user.cart.splice(index, 1);
        }

        await user.save();
        req.flash("success", "Item removed from cart!");
        res.redirect("/cart");
    } catch (err) {
        req.flash("error", "Could not remove item.");
        res.redirect("/cart");
    }
});

// Clear entire cart
router.get('/clearcart', isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        user.cart = [];
        await user.save();
        req.flash("success", "Cart cleared!");
        res.redirect("/cart");
    } catch (err) {
        req.flash("error", "Could not clear cart.");
        res.redirect("/cart");
    }
});

// Simple GET delete (less secure, but works)
router.get('/deleteproduct/:productid', isLoggedin, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.productid);
        req.flash("success", "Product deleted successfully!");
        res.redirect("/shop");
    } catch (err) {
        req.flash("error", "Could not delete product.");
        res.redirect("/shop");
    }
});

router.get("/logout", isLoggedin, function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
});


module.exports = router;

