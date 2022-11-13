const express = require("express");
 require("dotenv").config();
const app = express();
const CONNECTDB =require("./database/connect");
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const Cart = require("./models/Cart");
const amqp = require("amqplib");
const PORT = process.env.PORT || 5001;
let channel;
let connection;

//database
CONNECTDB(process.env.MONGO_DB);


// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("cart-service-queue");
  }
  
  createCart = async(products, userId,qty) => {
    const cart = await Cart.findOne({ userId: userId })
    const { _id } = products;
    if(cart){
        let isExist = false;
        let cartItems = cart.products;
        if(cartItems.length > 0){

            cartItems.map(item => {                       
                if(item.product._id === _id){
                      item.qty = 2;
                     isExist = true;
                }
            });
        } 
        
        if(!isExist){
            cartItems.push({product:products });
        }
        
        cart.products = cartItems;

        return await cart.save();
      
    }else{
       return await Cart.create({
            userId,
            products:[{product:products }]
        })
    }
  };
  
  connectToRabbitMQ().then(() => { 
    channel.consume("cart-service-queue", (data) => {
      // order service queue listens to this queue
      const { products,userId,qty } = JSON.parse(data.content);
      const newCart = createCart(products,userId,qty);
      channel.ack(data);
      channel.sendToQueue(
        "product-service-queue",
        Buffer.from(JSON.stringify(newCart))
      );
    });
  });




  app.get('/cart/:id',async (req,res)=>{
    
    try {
        const cart = await Cart.findOne({userId:req.params.id});
        res.status(200).json(cart);   
    } catch (error) {
       console.log(error); 
    }
    
  })

//errorHandler
app.use(ErrorHandler);


//listen
app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`);
})