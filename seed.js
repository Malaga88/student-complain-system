/**
 * Creates a starter staff account so you can log in immediately.
 * Run with: npm run seed
 *
 *   Email:    staff@atbu.edu.ng
 *   Password: staffpass123
 *
 * Change this password (or delete the account and register your own
 * via the database) before deploying or submitting this project.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

async function seed() {
  await connectDB();

  const existing = await User.findOne({ email: 'staff@atbu.edu.ng' });
  if (existing) {
    console.log('Staff account already exists — nothing to do.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('staffpass123', 10);
  await User.create({
    role: 'staff',
    fullName: 'Student Affairs Officer',
    email: 'staff@atbu.edu.ng',
    passwordHash,
    department: 'Student Affairs',
  });

  console.log('Staff account created.');
  console.log('  Email:    staff@atbu.edu.ng');
  console.log('  Password: staffpass123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
