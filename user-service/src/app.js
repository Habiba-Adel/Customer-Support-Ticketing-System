const express = require("express");
const userRoutes = require("./routes/user.routes");
const client = require('prom-client');

const app = express();

//adding the monitoring endpoint code to can be called to get the data from it
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(express.json());
app.use("/api/users", userRoutes);

module.exports = app;