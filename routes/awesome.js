var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/awesomeChat', function(req, res, next) {
  res.sendfile('././index.html');
});

module.exports = router;
