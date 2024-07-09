const mongoose = require('mongoose')
// mongoose.connect("mongodb://localhost:27017/Scratch");

const userSchema = mongoose.Schema({
    fullname: {
      type: String,
      minLength: 3,
      trim: true,
    },
    email: String,
    password: String,
    cart: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
  
    orders: [{
      type: Array,
      default: [],
    }],
    contact: Number,
    picture: String,
  });
  


  module.exports = mongoose.model("user", userSchema);