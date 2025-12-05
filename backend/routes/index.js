const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'HunarmandPro API is healthy' });
});

module.exports = router;

