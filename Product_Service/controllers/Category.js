const Category = require("../models/Category");
const Product = require("../models/Product");
const ApiError = require("../../Errorhandler/Error");

class CategoryController {
createCategory = async (req,res,next) => {
    try {
        const {name} = req.body
        const categories = await Category.findOne({name});
         if(categories) next(ApiError.BadRequest("This category already exist"));
         const category = new Category({name})

        await category.save();
        res.status(200).json({msg:"category created"});
        
    } catch (error) {
        next(ApiError.InternalServerError(error));
    }
 }

getCategory = async (req,res,next) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (err) {
        return next(ApiError.InternalServerError(err));
    }

}

deleteCategory = async (req,res,next)=> {
    try {
        const products = await Product.findOne({category: req.params.id})
        if(products) return res.status(400).json({
            msg: "Please delete all products with a relationship."
        })

        await Category.findByIdAndDelete(req.params.id)
        res.json({msg: "Deleted a Category"})
    } catch (err) {
        return next(ApiError.InternalServerError(err));
    }
}

updateCategory = async (req,res,next) => {
    try {
        const {name} = req.body;
        await Category.findOneAndUpdate({_id: req.params.id}, {name})

        res.json({msg: "Updated a category"})
    } catch (err) {
        return next(ApiError.InternalServerError(err));
    }
}

};

module.exports = new CategoryController();