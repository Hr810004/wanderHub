// routes/map.js
const express = require('express');
const router = express.Router();

// Route for the map page
router.get('/', (req, res) => {
  res.render('map'); // This will render the map.ejs page
});

module.exports = router;
