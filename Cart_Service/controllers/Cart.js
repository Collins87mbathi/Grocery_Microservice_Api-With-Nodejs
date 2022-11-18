const Cart = require("../models/Cart");
const ApiError = require("../../Errorhandler/Error");


const getCart = async (req,res,next) => {
    try {
        const cart = await Cart.findOne({userId:req.user.id});
        res.status(200).json(cart);   
    } catch (error) {
       next(ApiError.InternalServerError(error));
    }
}

const deleteCartOne = async (req,res,next) => {
   try {
      // removed one product in an array of products in our carts database
      await Cart.updateOne({"userId":req.user.id}, {$pull: {"products": {_id:req.params.id}}})
      res.status(200).json("product removed from cart");
   } catch (error) {
      next(ApiError.InternalServerError(error));
   } 
}

const deleteCart = async (req,res,next) => {
 try {
    await Cart.findOneAndDelete({userId: req.user.id});
    res.status(200).json("removed cart");
 } catch (error) {
    next(ApiError.InternalServerError(error));
 }
};


module.exports = {getCart,deleteCartOne,deleteCart};
