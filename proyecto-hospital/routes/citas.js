var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('citas', { title: 'Cita', title2: 'CITAS PROGRAMADAS', opcion: 'disabled', estado: true });
});

module.exports = router;