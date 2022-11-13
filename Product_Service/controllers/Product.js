const Product = require("../models/Product");
const ApiError = require("../../Errorhandler/Error");

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
       const queryObj = {...this.queryString} //queryString = req.query

       const excludedFields = ['page', 'sort', 'limit']
       excludedFields.forEach(el => delete(queryObj[el]))
       
       let queryStr = JSON.stringify(queryObj)
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
       this.query.find(JSON.parse(queryStr))
         
       return this;
    }

}

class ProductController {
createProduct = async (req,res,next) => {
    try {
        const {title,price,desc,category,img} = req.body;
     
        if(!img) return next(ApiError.BadRequest("no images uploaded"));
     
        const newProducts = new Product({
            title: title.toLowerCase(),price,desc,category,img
        });
      await newProducts.save();
      res.status(200).json({msg:"product created"});
     
     } catch (error) {
         next(ApiError.InternalServerError(error));
     }

}

getProduct = async (req,res,next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        next(ApiError.InternalServerError(error));
    }
}

deleteProduct = async (req,res,next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(200).json({msg:"product deleted successfully"});

    } catch (error) {
        next(ApiError.InternalServerError(error));
    }
}

updateProduct = async (req,res,next) => {
    try {
        const {title, price, desc, img, category} = req.body;
        if(!img) return next(ApiError.InternalServerError("no image uploaded"))

      await Product.findOneAndUpdate({_id:req.params.id},{
       title:title.toLowerCase(),price,desc,category
      });

    res.status(200).json({msg:"product updated"});

    } catch (error) {
     next(ApiError.InternalServerError(error));
    }
}

getProducts = async (req,res,next) => {
    try {
         const features = new APIfeatures(Product.find(),req.query).filtering();
         const products = await features.query; 
            res.status(200).json({products})
      } catch (error) {
          next(ApiError.InternalServerError(error));
      }
}

};
 
module.exports = new ProductController();