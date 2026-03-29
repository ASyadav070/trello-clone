const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Standard independent member listing endpoint
router.get('/', memberController.getAllMembers);

module.exports = router;
