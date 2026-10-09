require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const connectDB = require('./config/db');
const { attachUser } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_system';

// ---- View engine ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
}));

app.use(attachUser);

// ---- Routes ----
app.use('/', authRoutes);
app.use('/student', studentRoutes);
app.use('/staff', staffRoutes);

// ---- 404 ----
app.use((req, res) => {
  res.status(404).render('404');
});

// ---- Start ----
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Online Students' Complaint System running at http://localhost:${PORT}`);
  });
});
