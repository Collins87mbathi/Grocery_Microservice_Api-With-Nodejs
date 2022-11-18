const express = require("express");
const Order = require("./models/Order");
 require("dotenv").config();
const app = express();
const CONNECTDB =require("./database/connect");
const OrderRoute = require("./router/Order");
const ErrorHandler = require("../Errorhandler/ErrorHandler");
const amqp = require("amqplib");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
let bodyId
let channel;
let connection;
const PORT = process.env.PORT || 5003;

//database
CONNECTDB(process.env.MONGO_DB);

//middlewares
app.use(express.json());

// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("order-service-queue");
  }

const createOrder = async (products,userId,amount,orderId,paymentMethod,number) => {
if(paymentMethod === "On delivery") {
  bodyId =  `you have just placed an order of id ${orderId} you are going to recieve your product as soon as possible`
} else {
 bodyId = `you have just placed an order of id ${orderId} please finish your payment process so that you can recieve your product on time`
}
  client.messages
    .create({
       body: bodyId,
       from: process.env.PHONE_NUMBER,
       to: number
     })
    .then(message => console.log(message.sid));
    const orderSave = new Order({
        products,
        userId,
        amount,
        orderId,
        paymentMethod,
        number
      });
      await orderSave.save();
      return orderSave;
};

    //connecting to rabbitmq
    connectToRabbitMQ().then(() => { 
        channel.consume("order-service-queue", (data) => {
          // order service queue listens to this queue
          const { products,userId,amount,orderId,paymentMethod,number } = JSON.parse(data.content);
          const newOrder = createOrder(products,userId,amount,orderId,paymentMethod,number);
          channel.ack(data);
          channel.sendToQueue(
            "cart-service",
            Buffer.from(JSON.stringify(newOrder))
          );
        });
      });

//router
app.use('/api/order',OrderRoute);

//errorHandler
app.use(ErrorHandler);


//listen
app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`);
})