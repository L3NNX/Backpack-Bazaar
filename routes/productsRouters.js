const express=require('express');
const router= express.Router();
const upload= require("../config/multerConfig")
const productModel = require("../models/productmodel")
const isAdmin = require("../middleware/isAdmin"); 

router.post("/create",isAdmin,upload.single("image"),async function (req,res){
    try {
        let {name,price,discount,bgcolor,textcolor,panelcolor} = req.body;
        
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            textcolor,
            panelcolor,
            category
        })
        // console.log(product)
        req.flash("success","product created successfully")
        res.redirect("/owners/admin")
        
    } catch (error) {
        res.send(error)
    }

}); 

// Get Edit Product Page
router.get("/edit/:productid", isAdmin, async (req, res) => {
    try {
        const product = await productModel.findById(req.params.productid);
        if (!product) return res.status(404).send("Product not found");
        res.render("createProduct", { product, success: null });
    } catch (err) {
        res.status(500).send("Error loading product");
    }
});

// Update Product
router.post("/edit/:productid", isAdmin, upload.single("image"), async (req, res) => {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor,category } = req.body;

        let updateData = {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
            category
        };

        // If new image uploaded
        if (req.file) {
            updateData.image = req.file.buffer;
        }

        await productModel.findByIdAndUpdate(req.params.productid, updateData);

        req.flash("success", "Product updated successfully!");
        res.redirect("/owners/products");

    } catch (err) {
        res.status(500).send("Error updating product");
    }
});

// Delete product from shop (admin only)
router.delete('/delete/:productid', async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.productid);
        req.flash("success", "Product deleted successfully!");
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: "Could not delete product" });
    }
});


module.exports = router;