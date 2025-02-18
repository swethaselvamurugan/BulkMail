const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express()
app.use(cors())
app.use(express.json())
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(function () {
    console.log("Connected to DB")
}).catch(function () {
    console.log("Failed to connect DB")
})

const Credentials = mongoose.model("credentials", {}, "bulkmail")

app.post("/sendmail", async (req, res) => {
    try {
        const { mailList, msg } = req.body;
        const data = await Credentials.find();
        if (!data.length) {
            return res.status(500).json({ error: "No email credentials found" });
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            }
        });
        new Promise(async (resolve, reject) => {
            try {
                for (let i = 0; i < mailList.length; i++) {
                    await transporter.sendMail({
                        from: data[0].toJSON().user,
                        to: mailList[i],
                        subject: "A message from Bulk Mail App",
                        text: msg
                    });
                    console.log("Email sent to: " + mailList[i]);
                }
                resolve("Success");
            } catch (error) {
                reject("Failed");
            }
        })
            .then(() => {
                res.send(true);
            })
            .catch(() => {
                res.status(500).send(false);
            });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ success: false, message: "Failed to send emails" });
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log("Server started...")
})



