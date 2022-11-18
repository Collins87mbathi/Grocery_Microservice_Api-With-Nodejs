const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
orderId: {
 type:String
},  
userId: {
    type:String
},
amount : {
  type:String
},
date: {type: Date, default: Date.now()},
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
        }, 
],
paymentMethod: {
   type: String
},
isDelivered: {
  type:Boolean,
  default :false
},
isPaid: {
  type:Boolean,
  default :false
},
number: {
  type:String
}
},
{timestamps:true}
);


module.exports = mongoose.model("Order",OrderSchema);