require('dotenv').config();
const dbConnection = require('./config/db');
const express = require('express');
const app = express();
const cors = require('cors');
const healthRoute  = require('./routes/health.routes');
const serviceRoutes = require('./routes/service.routes')
const authRoutes = require('./routes/auth.routes');
const availabilityRoutes = require('./routes/availability.route');


dbConnection();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionSuccessStatus: "200"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/health',healthRoute);
app.use('/api/services',serviceRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/availability', availabilityRoutes);

app.listen(PORT, ()=>{
    console.log("Successfully listening on PORT: ",PORT);
})