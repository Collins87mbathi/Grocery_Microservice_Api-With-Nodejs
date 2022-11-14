const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
 userId : {
    type:String
 },
 products: [
    {
            _id: { type: String, require: true},
            title: { type: String, require:true},
            desc: { type: String, require:true},
            category: { type: String, require:true},
            img: { type: Object,require:true},
            qty: { type: Number,require:true},
            price: { type: Number,require:true},
            total: {type:Number, require:true} 
    }
 ],
},{timestamps:true});

module.exports = mongoose.model('Cart', CartSchema);