const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    orders: {
        type: Array,
        default: [],
    },
    contact: Number,
    picture: String,
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

module.exports = mongoose.model("user", userSchema);