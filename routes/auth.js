const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

// ---- Register (students only; staff accounts are provisioned via seed.js) ----

router.get('/register', (req, res) => {
  res.render('register', { error: null, form: {} });
});

router.post('/register', async (req, res) => {
  const { fullName, matricNumber, department, email, password, confirmPassword } = req.body;

  if (!fullName || !matricNumber || !department || !email || !password) {
    return res.render('register', { error: 'Please fill in every field.', form: req.body });
  }
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match.', form: req.body });
  }
  if (password.length < 6) {
    return res.render('register', { error: 'Password must be at least 6 characters.', form: req.body });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.render('register', { error: 'An account with that email already exists.', form: req.body });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: 'student',
      fullName,
      matricNumber,
      department,
      email: email.toLowerCase(),
      passwordHash,
    });

    req.session.user = { id: user._id.toString(), role: user.role, fullName: user.fullName };
    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Please try again.', form: req.body });
  }
});

// ---- Login (shared by students and staff) ----

router.get('/login', (req, res) => {
  res.render('login', { error: null, email: '' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please enter your email and password.', email });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render('login', { error: 'No account found with that email.', email });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.render('login', { error: 'Incorrect password.', email });
    }

    req.session.user = { id: user._id.toString(), role: user.role, fullName: user.fullName };
    res.redirect(user.role === 'staff' ? '/staff/dashboard' : '/student/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Please try again.', email });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
