const mongoose = require('mongoose')

const productSchema=mongoose.Schema({
    image: Buffer,
    name: String,
    discount:{
        type: Number,
        default: 0,
    },

    price:Number,
    bgcolor:String,
    panelcolor:String,
    textcolor:String,
    category: {
        type: String,
        enum: ['backpack', 'tote', 'handbag', 'clutch', 'duffle', 'other'],
        default: 'other'
    },
})

module.exports = mongoose.model('product', productSchema)