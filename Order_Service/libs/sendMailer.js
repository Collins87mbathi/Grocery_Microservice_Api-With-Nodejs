const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const sendEmail = async (email,orderId,amount) => {

    try {
     
     let transporter = nodemailer.createTransport({
         service:"gmail",
         host:"smtp.gmail.com",
         port:465,
         secure:true, // true for 465 , false for other ports
         
         auth: {
             user:process.env.USER, //username
             pass:process.env.PASSWORD, //user password
         },


     });
     
     await transporter.sendMail({
         from:process.env.USER,
         to:email,
         subject:"perez Grocery",
         html: `
         <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
         <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to perez Grocery.</h2>
         <p>Your order of id ${orderId} is ready for delivery you will get your package soon, you will pay amount ${amount} shs soon after getting the product.
         thank you for shopping with us.
         </p>
         </div>
     `
     });
     console.log("email sent successfully");

    } catch (err) {
    console.log("email not sent");        
    console.log(err);

    }



};

module.exports = sendEmail;