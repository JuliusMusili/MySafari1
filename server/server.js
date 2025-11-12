require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mysafari';
connectDB(MONGO_URI);

app.get('/', (req, res) => res.send('MySafari API running'));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  // optional seed on start
  if (process.env.SEED === 'true') {
    console.log('Running seed script...');
    const spawn = require('child_process').spawn;
    const s = spawn('node', ['seed.js'], { stdio: 'inherit' });
    s.on('close', () => console.log('Seed finished'));
  }
});
