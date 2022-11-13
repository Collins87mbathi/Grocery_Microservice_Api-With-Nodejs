const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
     },
     desc: {
       type: String,
       required: true,
     },
     category: {
        type: String,
        required: true
     },
     img: {
        type: Object,
        required:true
     },
     price: {
       type: String,
       required:true
     },
}, {
    timestamps:true
});

module.exports = mongoose.model('Product', productSchema);