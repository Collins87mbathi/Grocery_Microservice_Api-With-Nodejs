const router = require('express').Router();
const {updateOrders,getOrders,deleteManyOrders,deleteOrders} = require("../controller/Order");
const {verifyToken} = require("../../Verification/VertifyToken");

router.get('/',verifyToken,getOrders);
router.delete('/all',verifyToken,deleteManyOrders);
router.put('/:id',verifyToken,updateOrders);
router.delete('/:id',verifyToken,deleteOrders);


module.exports = router;



