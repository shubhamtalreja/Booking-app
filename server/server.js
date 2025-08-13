require('dotenv').config();
const dbConnection = require('./config/db');
const express = require('express');
const app = express();
const cors = require('cors');
const healthRoute  = require('./routes/health.routes');
const serviceRoute = require('./routes/service.routes')


dbConnection();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionSuccessStatus: "200"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/health',healthRoute);
app.use('/api/services',serviceRoute);

app.listen(PORT, ()=>{
    console.log("Successfully listening on PORT: ",PORT);
})