const express = require('express');
const Complaint = require('../models/Complaint');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const CATEGORIES = ['hostel', 'academic', 'welfare', 'harassment', 'other'];

router.use(requireRole('student'));

router.get('/dashboard', async (req, res) => {
  const complaints = await Complaint.find({ student: req.session.user.id })
    .sort({ createdAt: -1 });
  res.render('student/dashboard', { complaints });
});

router.get('/complaints/new', (req, res) => {
  res.render('student/new-complaint', { error: null, categories: CATEGORIES, form: {} });
});

router.post('/complaints/new', async (req, res) => {
  const { category, subject, description } = req.body;

  if (!category || !subject || !description) {
    return res.render('student/new-complaint', {
      error: 'Please fill in every field.',
      categories: CATEGORIES,
      form: req.body,
    });
  }
  if (!CATEGORIES.includes(category)) {
    return res.render('student/new-complaint', {
      error: 'Please choose a valid category.',
      categories: CATEGORIES,
      form: req.body,
    });
  }

  await Complaint.create({
    student: req.session.user.id,
    category,
    subject,
    description,
  });

  res.redirect('/student/dashboard');
});

router.get('/complaints/:id', async (req, res) => {
  const complaint = await Complaint.findOne({
    _id: req.params.id,
    student: req.session.user.id,
  }).populate('responses.staff', 'fullName department');

  if (!complaint) {
    return res.status(404).render('404');
  }

  res.render('student/view-complaint', { complaint });
});

module.exports = router;
