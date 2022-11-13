const ApiError = require("../../Errorhandler/Error");
const User = require("../models/User");
const Address = require("../models/Address");
const EmailValidator = require("../utils/EmailValidator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// const hashPassword = require("../HashingPassword/password");
dotenv.config();


class UserMethods {
    //creating a user method
 CreateUser = async (req,res,next) => {
    try {
        const {name,email,password} = req.body;
        if(!name ||!email || !password) return next(ApiError.BadRequest("please input values"));
        //validating that the email is correct
        if(!EmailValidator(email)) return next(ApiError.BadRequest("this is not a valid Email"));

        const finduser = await User.findOne({email:email});
        //checking id the user already exist in the system
        if(finduser) return next(ApiError.BadRequest("this user already exist"));
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);

        //creating and saving the user
        const saveUser = await new User({
            name,
            email,
            password:hashpassword
        });
       const user = await saveUser.save();

       res.status(200).json(user);
    } catch (error) {
       next(ApiError.InternalServerError(error)); 
    }
 }
 //Login user
 LoginUser = async (req,res,next) => {
 try {
 if(!req.body.email || !req.body.password) return next(ApiError.BadRequest("please input values"));
 //checking if the  user exist
 const user = await User.findOne({email:req.body.email});
 if(!user) return next(ApiError.BadRequest("user doesn't exist"));
 //confirming if the password matches
 const ismatch = await bcrypt.compare(req.body.password,user.password);
 if(!ismatch) return next(ApiError.BadRequest("incorrect password"));
 //added the jsonwebtoken
 const token = jwt.sign({id:user._id,isAdmin:user.isAdmin}, 'collo');
 const {password, ...otherDetails} = user._doc;

 res.status(200).json({user:{...otherDetails,token}});

 } catch (error) {
    next(ApiError.InternalServerError(error));
 }
 }

 GetUser = async (req,res,next) => {
    try {
     const user = await User.findById(req.params.id).populate("address");
     if(!user)return next(ApiError.BadRequest("user not found")); 
     res.status(200).json(user);  
    } catch (error) {
        next(ApiError.InternalServerError(error));
    }
 }

GetAllUser = async (req,res,next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
       next(ApiError.InternalServerError(error)); 
    }
} 

GetUserDelete = async (req,res,next) => {
    try {
     await User.findByIdAndDelete(req.params.id);
     res.status(200).json("user has been deleted")
    } catch (error) {
       next(ApiError.InternalServerError(error)); 
    }
}

GetUserUpdate = async (req,res,next) => {
try {
    const user = await User.findOneAndUpdate({_id:req.params.id},{
        name:req.body.name
       });
    res.status(200).json(user);
} catch (error) {
  next(ApiError.InternalServerError(error));  
}
}

GetAddress = async (req,res,next) => {
    try {
        const { _id } = req.user;
        const profile = await User.findById(_id);
        if(profile){  
        const {subcounty,street,postNumber, city} = req.body;
        const postaddress = await new Address({_id,subcounty,street,postNumber, city}); 
        await postaddress.save();
        profile.address.push(postaddress);
        res.status(200).json("The address is updated");
        }
        return await profile.save();
    } catch (error) {
        next(ApiError.InternalServerError(error));
    }
}

};

module.exports = new UserMethods();