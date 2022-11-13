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
     product: { 
           _id: { type: String, require: true},
           name: { type: String},
           photo: { type: Object},
           quantity: { type: Number},
           price: { type: Number},
       },
   }
],
wishlist:[
   {
       _id: { type: String, require: true },
       name: { type: String },
       description: { type: String },
       banner: { type: String },
       avalable: { type: Boolean },
       price: { type: Number },
   }
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