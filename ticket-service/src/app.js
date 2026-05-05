const express = require("express");
const ticketRoutes = require("./routes/ticket.routes");
const client = require('prom-client');

const app = express();

//adding the endpoint code of the monitoring to can be called to get the data
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use(express.json());
app.use("/api/tickets", ticketRoutes);

module.exports = app;