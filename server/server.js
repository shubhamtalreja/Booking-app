require('dotenv').config();
const dbConnection = require('./config/db');
const express = require('express');
const app = express();
const cors = require('cors');
const healthRoute = require('./routes/health.routes');
const serviceRoutes = require('./routes/service.routes')
const authRoutes = require('./routes/auth.routes');
const availabilityRoutes = require('./routes/availability.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const startScheduler = require('./scheduler');
const errorHandler = require('./middleware/error.middleware');
const otpRoutes = require('./routes/otp.routes');
const vendorRoutes = require('./routes/vendor.routes');
dbConnection();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionSuccessStatus: "200"
}

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
  console.log('Morgan logger enabled for development.');
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/health', healthRoute);
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/vendors',vendorRoutes)
startScheduler();
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Successfully listening on PORT: ", PORT);
})