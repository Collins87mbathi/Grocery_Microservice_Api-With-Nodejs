const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const UserRoute = require("./router/User");
const PORT  = process.env.PORT || 5002 ;
const Connect = require("./Database/connect");

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Database Connection 
Connect.CONNECTDB(process.env.URL);

//routes
app.use('/api/user',UserRoute);

//error handler
app.use(ErrorHandler);
//listen
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
})