const express = require("express");
const dotenv = require("dotenv");
// const cors = require("cors");
dotenv.config();
const app = express();
const fileUpload = require('express-fileupload');
const CONNECTDB = require("../Product_Service/Database/connect");
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const ProductRoute = require("./routers/Product");
const CategoryRoute = require("./routers/Category");
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({    
    useTempFiles: true
}));
// app.use(cors({origin:'*'}))
//Database connection
CONNECTDB(process.env.MONGO_DB);
//routers
app.use('/api/products',ProductRoute);
app.use('/api/category',CategoryRoute);

//errorHandler
app.use(ErrorHandler);


//listening
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
})