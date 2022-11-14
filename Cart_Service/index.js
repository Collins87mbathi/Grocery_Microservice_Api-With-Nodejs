const express = require("express");
 require("dotenv").config();
const app = express();
const CONNECTDB =require("./database/connect");
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const Cart = require("./models/Cart");
const CartRoute = require("../Cart_Service/router/Cart");
const amqp = require("amqplib");
const PORT = process.env.PORT || 5001;
let channel;
let connection;

//database
CONNECTDB(process.env.MONGO_DB);

//middlewares
app.use(express.json());

// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("cart-service-queue");
  }
   //cart logic
  const createCart = async(products, userId,qty,total) => {
    const cart = await Cart.findOne({ userId: userId })
    const { _id } = products;
    if(cart){
        let isExist = false;
        let cartItems = cart.products;   
        if(cartItems.length > 0){

            cartItems.map(item => {                       
                if(item._id === _id){
                     item.qty = item.qty + 1
                     isExist = true;
                     total += item.price* item.qty + 1
                } 
            });
        } 
        if(!isExist){
            cartItems.push({...products,qty:qty,total:total});
        }
        cart.products = cartItems;
      return  await cart.save();
    }else{
       return await Cart.create({
            userId,
            products:[{...products,qty:qty,total:total}],
            
        })
    }
    
  };

  //connecting to rabbitmq
  connectToRabbitMQ().then(() => { 
    channel.consume("cart-service-queue", (data) => {
      // order service queue listens to this queue
      const { products,userId,qty } = JSON.parse(data.content);
      let total = products.price * qty;
    
      const newCart = createCart(products,userId,qty,total);
      channel.ack(data);
      channel.sendToQueue(
        "product-service-queue",
        Buffer.from(JSON.stringify(newCart))
      );
    });
  });

//routers
app.use('/api',CartRoute);
  
//errorHandler
app.use(ErrorHandler);


//listen
app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`);
})