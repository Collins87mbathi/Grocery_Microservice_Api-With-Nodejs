const express = require("express");
 require("dotenv").config();
const app = express();
const CONNECTDB =require("./database/connect");
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const PORT = process.env.PORT;


//database
CONNECTDB(process.env.MONGO_DB);

//router


//errorHandler
app.use(ErrorHandler);


//listen
app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`);
})