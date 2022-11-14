const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
 },
 email: {
   type: String,
   required: true,
 },
 password: {
    type: String,
    required: true
 },
 avatar: {
    type: Object
 },
 isAdmin: {
   type: Boolean,
   default:false
 },
 address: [{
  type: mongoose.Schema.Types.ObjectId,
  ref:'Address',
 }],
 cart: [
   {
      _id: { type: String, require: true},
      title: { type: String, require:true},
      desc: { type: String, require:true},
      category: { type: String, require:true},
      img: { type: Object,require:true},
      qty: { type: Number,require:true},
      price: { type: Number,require:true},
      total: {type:Number, require:true} 
},
],
orders: [
   {
       _id: {type: String, required: true},
       amount: { type: String},
       date: {type: Date, default: Date.now()}
   }
]
 
},{timestamps:true})


module.exports = mongoose.model('User', userSchema);