const mongoose = require("mongoose");

const addressSchema  = new mongoose.Schema({
 city: {
  type:String
 },
 subcounty:{
  type:String
 },
 street : {
    type: String
 },
 number: {
    type:String
 }
},
{timestamps:true}
);

module.exports = mongoose.model('Address', addressSchema);