require('dotenv').config();
const dbConnection = require('./config/db');
const express = require('express');
const app = express();

dbConnection();
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>{
    console.log("Successfully listening on PORT: ",PORT);
})