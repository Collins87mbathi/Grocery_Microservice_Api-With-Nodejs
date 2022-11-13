const router = require("express").Router();
const UserMethods = require("../controllers/User");
const {verifyUser,verifyAdmin} = require('../../Verification/VertifyToken');

router.post('/register',UserMethods.CreateUser);
router.post('/login',UserMethods.LoginUser);
router.get('/all',verifyAdmin,UserMethods.GetAllUser);
router.post('/address',verifyUser,UserMethods.GetAddress);
router.get('/:id',verifyAdmin,UserMethods.GetUser);
router.put('/:id',verifyUser,UserMethods.GetUserUpdate);
router.delete('/:id',verifyUser,UserMethods.GetUserDelete);

module.exports = router;
