const jwt = require("jsonwebtoken");
const ApiError = require("../errorhandler/error");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
      jwt.verify(token, 'collo', (err, user) => {
          if (err) {
              return res.status(401).json({ msg: 'Token is not valid' });
          }
          req.user = user;
          next();
      });
  } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
  }
}
   
   const verifyUser = (req,res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
          next();
        } else {
          return res.status(402).json("You are not Authorized");
        }
      });
   }
   const verifyAdmin = (req,res,next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
          next();
        } else {
          return res.status(402).json("You are not Authorized");;
        }
      });
   } 
   
   module.exports = {verifyToken,verifyUser,verifyAdmin};