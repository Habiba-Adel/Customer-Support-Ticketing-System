const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes');
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Analyst Service connected to MongoDB"))
    .catch(err => console.error("❌ Analyst Service failed to connect to MongoDB:", err));

app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Reporting Service is running on port ${PORT}`);
});