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
      const cart = await Cart.findOne({userId:req.user.id});
        if(cart) {
           let cartItems = cart.products;
           cartItems.map((item)=>{
            if(item.product._id === req.params.id) {
            cartItems.splice(cartItems.indexOf(item), 1);
            } else {
                next(ApiError.BadRequest("product not found"));
            }
           })  
        }
        res.status(200).json("removed product from cart");

    } catch (error) {
       console.log(error); 
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
