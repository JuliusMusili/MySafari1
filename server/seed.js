require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Route = require('./models/Route');
const Vehicle = require('./models/Vehicle');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/mysafari');

    await User.deleteMany();
    await Route.deleteMany();
    await Vehicle.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('AdminPass123!', salt);
    const empPass = await bcrypt.hash('Employee123!', salt);

    const admin = await User.create({
      name: 'MySafari Admin',
      email: 'admin@mysafari.local',
      passwordHash: adminPass,
      role: 'admin',
      phone: '+254700000001'
    });

    const employee = await User.create({
      name: 'Jane Employee',
      email: 'jane@company.local',
      passwordHash: empPass,
      role: 'employee',
      phone: '+254700000002',
      preferredDropoff: 'Kileleshwa'
    });

    const r1 = await Route.create({ name: 'Kilimani - CBD', stops: ['Kilimani','Westlands','CBD'], estimatedTime: 30 });
    const r2 = await Route.create({ name: 'South C - CBD', stops: ['South C','Langata','CBD'], estimatedTime: 40 });

    const v1 = await Vehicle.create({ regNumber: 'KCA 123A', driverName: 'John Driver', driverPhone: '+254700111111', capacity: 12, assignedRoute: r1._id });
    const v2 = await Vehicle.create({ regNumber: 'KCB 456B', driverName: 'Mary Driver', driverPhone: '+254700222222', capacity: 12, assignedRoute: r2._id });

    console.log('Seed complete: admin, employee, routes, vehicles');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
})();
