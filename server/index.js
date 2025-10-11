require("dotenv").config();

const http = require('http');
const db = require('./configs/db');
const express = require('express');
const cors = require('cors');


const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const app = express(); db();


const corsOptions = {
  origin: true, // reflect request origin to support multiple domains & production
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});


app.use(express.json());
app.use("/alowork/db", require("./route/DB"));
app.use("/alowork/user", require("./route/AloWorkUser"));

// Health check endpoint

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);;
})

module.exports = app;