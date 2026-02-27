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
        })
        // console.log(product)
        req.flash("success","product created successfully")
        res.redirect("/owners/admin")
        
    } catch (error) {
        res.send(error)
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