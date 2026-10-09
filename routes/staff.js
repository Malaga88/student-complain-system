const express = require('express');
const Complaint = require('../models/Complaint');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const CATEGORIES = ['hostel', 'academic', 'welfare', 'harassment', 'other'];
const STATUSES = ['pending', 'in_progress', 'resolved'];

router.use(requireRole('staff'));

router.get('/dashboard', async (req, res) => {
  const { status, category } = req.query;
  const filter = {};
  if (status && STATUSES.includes(status)) filter.status = status;
  if (category && CATEGORIES.includes(category)) filter.category = category;

  const complaints = await Complaint.find(filter)
    .populate('student', 'fullName matricNumber department')
    .sort({ createdAt: -1 });

  const counts = {
    total: await Complaint.countDocuments(),
    pending: await Complaint.countDocuments({ status: 'pending' }),
    in_progress: await Complaint.countDocuments({ status: 'in_progress' }),
    resolved: await Complaint.countDocuments({ status: 'resolved' }),
  };

  res.render('staff/dashboard', {
    complaints,
    counts,
    categories: CATEGORIES,
    statuses: STATUSES,
    activeStatus: status || '',
    activeCategory: category || '',
  });
});

router.get('/complaints/:id', async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('student', 'fullName matricNumber department email')
    .populate('responses.staff', 'fullName department');

  if (!complaint) {
    return res.status(404).render('404');
  }

  res.render('staff/view-complaint', { complaint, statuses: STATUSES, error: null });
});

router.post('/complaints/:id/respond', async (req, res) => {
  const { message } = req.body;
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).render('404');
  }
  if (!message || !message.trim()) {
    const populated = await complaint.populate([
      { path: 'student', select: 'fullName matricNumber department email' },
      { path: 'responses.staff', select: 'fullName department' },
    ]);
    return res.render('staff/view-complaint', {
      complaint: populated,
      statuses: STATUSES,
      error: 'Please write a message before sending your response.',
    });
  }

  complaint.responses.push({ staff: req.session.user.id, message: message.trim() });
  await complaint.save();

  res.redirect(`/staff/complaints/${complaint._id}`);
});

router.post('/complaints/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return res.redirect(`/staff/complaints/${req.params.id}`);
  }

  await Complaint.findByIdAndUpdate(req.params.id, { status });
  res.redirect(`/staff/complaints/${req.params.id}`);
});

module.exports = router;
