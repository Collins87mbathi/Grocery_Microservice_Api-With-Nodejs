const router = require("express").Router();
const Product = require("../models/Product");
const ProductController = require("../controllers/Product");
const UploadController = require("../controllers/UploadController");
const upload = require('../utils/UploadImage');
const {verifyAdmin,verifyUser,verifyToken} = require("../../Verification/VertifyToken");
const amqp = require("amqplib");
let cart ;
let channel; 
let connection;
// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("product-service-queue");
  }
  connectToRabbitMQ();


router.post('/upload',upload,UploadController);
router.post('/',ProductController.createProduct);
router.get('/:id',ProductController.getProduct);
// router.put('/:id',ProductController.updateProduct);
router.get('/',ProductController.getProducts);
router.delete('/:id',ProductController.deleteProduct);
router.put('/cart',verifyUser, async (req, res) => {
    const { ids } = req.body;
    // Get products from database with the given ids
    const products = await Product.findOne({ _id:  ids  });
   
    // Send to RabbitMQnpm npm 
    channel.sendToQueue(
      "cart-service-queue",
      Buffer.from(
        JSON.stringify({
          products,
          userId:req.user.id,
          qty:1
        })
      )
    );
  
    // Consume from RabbitMQ
    channel.consume("product-service-queue", (data) => {
      console.log("Consumed from product-service-queue");
      cart = JSON.parse(data.content);
      channel.ack(data);
    });
    return res.status(201).json({
      message: "Cart placed successfully",
      cart,
    });
  
  
  } );

module.exports = router;