    const express=require('express');

    const router= express.Router();

    // if (process.env.NODE_ENV === "development") {
        router.post("/create", async function (req, res) {
            let owners = await ownerModel.find();
            if (owners.length>0) {
                return res.send("You do not have permission to create")
            }

            let { fullname, email, password } = req.body;
            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password: String,
            });
            res.send(createdOwner); 
        });
    // }
    

    router.use('/',(req,res)=>{
        res.send("Welcome");
    }); 

    module.exports = router;