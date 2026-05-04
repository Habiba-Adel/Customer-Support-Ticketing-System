<<<<<<< HEAD
//const dotenv = require('dotenv');
//dotenv.config()
const express = require("express");
const mongoose = require('mongoose');

const supportRoutes = require('./routes/support.routes');


const app = express()
const PORT =process.env.PORT || 3002
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas successfully!"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use('/api/support', supportRoutes);

app.get("/test" , (req , res)=>{
    res.send("hello")
})

app.listen(PORT , ()=>{
    console.log(`SUPPORT Service running on port :${PORT}`);
=======
const express = require("express");

const app = express()

app.get("/hello" , (req , res)=>{
    res.send("hello")
})

app.listen(3002 , ()=>{
    console.log("Ticket Service running on port 3002");
>>>>>>> frontend
})