const mongoose = require("mongoose");

const CONNECTDB = (url) => {
 mongoose.connect(url).then(()=> {
    console.log("database is connected");
 }).catch((err)=>{
    console.log(err);
 })
};

module.exports = CONNECTDB;