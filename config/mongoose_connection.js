const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Scratch")
    .then(function () {
        console.log("Connected to database");
    })
    .catch(function (err) {
        console.error("DB connection error:", err);
    });

module.exports = mongoose.connection;