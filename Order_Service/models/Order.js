const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
userId: {
    type:String
},
amount : {
  type:String
},
date: {type: Date, default: Date.now()},
items: [
    {   
        product: {
            _id: { type: String, require: true},
            title:{ type: String },
            desc: { type: String },
            img:  { type: String },
            price:{ type: String },
        }, 
    }
]
});


module.exports = mongoose.model("Order",OrderSchema);