const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL )
    .then(function () {
        console.log("Connected to database");
    })
    .catch(function (err) {
        console.error("DB connection error:", err);
    });

module.exports = mongoose.connection;