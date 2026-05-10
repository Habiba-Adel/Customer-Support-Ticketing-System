const express = require("express");
const ticketRoutes = require("./routes/ticket.routes");
const client = require('prom-client');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

//adding the endpoint code of the monitoring to can be called to get the data
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ticket Service API",
      version: "1.0.0",
      description: "API documentation for Ticket Service",
    },
    servers: [
      {
        url: "http://localhost:3003",
      },
    ],
  },
  apis: ["./src/docs/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use(express.json());
app.use("/api/tickets", ticketRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports = app;