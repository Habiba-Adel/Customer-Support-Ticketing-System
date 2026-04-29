const express = require("express");

const app = express()

app.get("/" , (req , res)=>{
    res.send("")
})

app.listen(3000 , ()=>{
    console.log("Ticket Service running on port 3001);
})