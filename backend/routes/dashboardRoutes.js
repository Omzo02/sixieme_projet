const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ton auth.js

// Route GET /api/dashboard
router.get('/dashboard', auth, (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur le dashboard',
    userId: req.auth.userId,
  });
});

module.exports = router;
