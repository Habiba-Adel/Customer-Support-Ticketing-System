const express = require("express");

const app = express()

app.get("/hello" , (req , res)=>{
    res.send("hello")
})

app.listen(3002 , ()=>{
    console.log("Ticket Service running on port 3002");
})