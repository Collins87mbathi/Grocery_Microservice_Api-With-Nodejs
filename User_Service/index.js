const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const UserRoute = require("./router/User");
const PORT  = process.env.PORT || 5002 ;
const Connect = require("./Database/connect");
const amqp = require("amqplib");
const User = require('./models/User');
let channel;
let connection;

// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("cart-service-queue");
  }

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Database Connection 
Connect.CONNECTDB(process.env.URL);

const createCart = async (products,userId,qty,total) => {
const user = await User.findOne({_id:userId});
const cartItems = user.cart;
const { _id } = products;
if(user){
    let isExist = false;   
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
    user.cart = cartItems;
  return  await user.save();
}

}


//routes
app.use('/api/user',UserRoute);

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

//error handler
app.use(ErrorHandler);
//listen
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
})