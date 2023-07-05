var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')
const tabla = new consulta.consultas('pacientes')
const columnaCita = "Id_medico"

/* GET users listing. */
router.get('/', function (req, res, next) {

  tabla.select("*", (error, results) => {
    console.log(results)
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      res.render('pacientes', { title: 'Paciente', title2: 'PACIENTES REGISTRADOS', pacientes: results, opcion: 'disabled', estado: true });
    }
  });

});

module.exports = router;