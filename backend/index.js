const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express()
app.use(cors())
app.use(express.json())
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(function(){
    console.log("Connected to DB")
}).catch(function(){
    console.log("Failed to connect DB")
})

const credentials = mongoose.model("credentials", {}, "bulkmail")

credentials.find().then(function(data){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: data[0].toJSON().user,
            pass: data[0].toJSON().pass,
        }
    })
    new Promise(async function(resolve, reject){
        try{
            for (i = 0; i < mailList.length; i++) {
                await transporter.sendMail({
                    from: "swetha040725@gmail.com",
                    to: mailList[i],
                    subject: "A message from Bulk Mail App",
                    text: msg
                })
                console.log("Email sent to: " + mailList[i])
            }
            resolve("Success")
        }
        catch{
            reject("Failed")
        }
    }).then(function(){
        res.send(true)
    }).catch(function(){
        console.log(false)
    })
}).catch(function(error){
    console.log(error)
})

app.listen(5000, function () {
    console.log("Server started...")
})



