const mongoose = require("mongoose");
const URL ="mongodb://mongodb:27017/notifications"
const connectDB = async(()=>{
  await mongoose.connect(URL)
  console.log("Connected to MongoDB")
})

module.exports = connectDB;