const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const mongoose = require('mongoose');

const supportRoutes = require('./routes/support.routes');


const app = express()
const PORT =process.env.PORT || 3000
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas successfully!"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use('/api/support', supportRoutes);

app.get("/test" , (req , res)=>{
    res.send("hello")
})

app.listen(PORT , ()=>{
    console.log(`SUPPORT Service running on port :${PORT}`);
})