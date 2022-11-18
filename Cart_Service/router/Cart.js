const router = require("express").Router();
const {verifyToken,verifyUser} = require("../../Verification/VertifyToken");
const {getCart,deleteCartOne,deleteCart} = require("../controllers/Cart");
const amqp = require("amqplib");
const { v4: uuidv4 } = require('uuid');
const Cart = require("../models/Cart");
let channel; 
let connection;
let order;
let products
let amount = 0;
let orderId = uuidv4();
let paymentMethod;
let number;

// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("cart-service");
  }
  connectToRabbitMQ();


router.get('/cart',verifyToken,getCart);
router.put('/cart/:id',verifyToken,deleteCartOne);
router.delete('/cart',verifyToken,deleteCart);
router.post('/cart/buy',verifyToken, async (req, res) => {
   paymentMethod = req.body.paymentMethod;
   number = req.body.number;
    // Get cart products from database with the given userId
    const carts = await Cart.findOne({ userId:  req.user.id });
    products = carts.products;    
    products.forEach((item) => {
        amount += item.total;
    });
    // Send to RabbitMQnpm npm 
    channel.sendToQueue(
      "order-service-queue",
      Buffer.from(
        JSON.stringify({
          orderId,
          products,
          userId:req.user.id,
          amount,
          paymentMethod,
          number
        })
      )
    );
    // Consume from RabbitMQ
    channel.consume("cart-service", (data) => {
      console.log("Consumed from cart-service");
      order = JSON.parse(data.content);
      channel.ack(data);
    });
    return res.status(201).json({
      message: "Order placed successfully",
      order
    });
  });

module.exports = router;