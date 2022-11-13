const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
 userId : {
    type:String
 },
 products: [
    {
        product: {
            _id: { type: String, require: true},
            name: { type: String, require:true},
            photo: { type: Object,require:true},
            qty: { type: Number,require:true},
            price: { type: Number,require:true}, 
        }
    }
 ]

});

module.exports = mongoose.model('Cart', CartSchema);