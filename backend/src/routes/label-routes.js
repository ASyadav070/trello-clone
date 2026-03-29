const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');

// Standard independent label listing endpoint
router.get('/', labelController.getAllLabels);

module.exports = router;
