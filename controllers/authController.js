const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken}= require("../utils/generateToken")
const userModel = require("../models/usermodel");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;
        console.log("Request body:", { email, password, fullname });

        let user = await userModel.findOne({ email: email });
        if (user) {
          return res.send("Usr connected");
        }
    

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    password = hash;
                    let user = await userModel.create({ 
                        email,
                        password,
                        fullname,
                    });

                    let token = generateToken(user);
                    res.cookie("token", token);

                    res.redirect("/shop");
                    // res.send("user created ");
                }
            });
        });
        
        
    } catch (error) {
        console.error(error.message);
    }
};

module.exports.loginUser = async function (req, res){
    let {email,password} = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) 
        return res.send("User not found");

        bcrypt.compare(password,user.password,  function (err, result) {
            if(result){

                let token = generateToken(user);  
                res.cookie("token", token);
                // res.send("User connected");
                res.redirect("/owners/admin");
            }
            
            else {
                res.send("User not found");
            }
        });
    
}


module.exports.logout = async function (req, res) {
    res.cookie("token","");
    res.redirect("/");
};