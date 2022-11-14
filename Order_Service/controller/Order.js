const Order = require("../models/Order");
const ApiError = require("../../Errorhandler/Error");


const getOrders = async (req,res,next) => {
 try {
    const order = await Order.find();
    if(!order) return next(ApiError.BadRequest("no orders available now"));
     res.status(200).json(order);
     } catch (error) {
   next(ApiError.InternalServerError(error)) 
 }
};
const updateOrders = async (req,res,next) => {
    try {
        await Order.updateOne({ _id: req.params.id }, { isDelivered: true });
        res.status(200).json("order updated"); 
    } catch (error) {
        next(ApiError.InternalServerError(error));
    }
};

const deleteOrders = async (req,res,next) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("order updated");
    } catch (error) {
      next(ApiError.InternalServerError(error));  
    }
};

const deleteManyOrders = async (req,res,next) => {
    try {
       await Order.deleteMany({isDelivered:true});
       res.status(200).json("orders deleted"); 
    } catch (error) {
       next(ApiError.InternalServerError(error)); 
    }
}

module.exports = {getOrders,updateOrders,deleteOrders,deleteManyOrders};