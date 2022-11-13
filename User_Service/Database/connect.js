const mongoose = require('mongoose');

class Connect {
    CONNECTDB = (url) => {
    mongoose.connect(url).then(()=>{
        console.log("database connected");
    }).catch(err => console.log(err));
    }
}
module.exports = new Connect();