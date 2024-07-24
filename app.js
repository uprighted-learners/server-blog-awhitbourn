//.env logic to encrypt code
require("dotenv").config()

const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

module.exports = app;
