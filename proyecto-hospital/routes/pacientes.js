var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')
const tabla = new consulta.consultas('pacientes')
const columnaCita = "id_paciente"

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
router.get('/enviar/:clave', function (req, res, next) {
  const clave = req.params.clave;
  tabla.select("*", (error, results) => {
    if (error) {
      console.log("Error en la consulta", error)
      res.status(500).send("Error en la consulta")
    } else {
      res.render('pacientes', { title: 'pacientes', title2: 'PACIENTES REGISTRADOS', claveSeleccionada: clave, pacientes: results, opcion: 'disabled', estado: false })
    }
  });
});

//Ruta de registro paciente
router.get('/agregar-paciente', function (req, res, next) {
  res.render('registro-paciente', { title: 'pacientes', layout: 'registro' })
});

//Accion del formulario de registro
router.post('/agregar', (req, res) => {
  const datos = funsiones.StringAuto(req.body)
  //nombre columnas base de datos en orden del formulario
  const thMedicos = 'cedula_paciente,nombre_paciente,apellido_paciente,edad,correo,telefono' 
  console.log(datos)
  tabla.Insert(thMedicos, datos, (error, results) => {
    if (error) {
      console.log("Ocurrio un error en la ejecución", error)
      res.status(500).render('errorSQL');
    } else {
      res.redirect('/pacientes');
    }
  });
})

//Accion de eliminar
router.get('/eliminar/:cedula', function (req, res, next) {
  const cedula = req.params.cedula
  const columna = "cedula_paciente"
  const tablaCita = new consulta.consultas('cita_medica')
  tablaCita.Delet(columnaCita, cedula, (error, results) => {
      if (error) {
          console.log("Error en la consulta", error)
          res.status(500).send("Error en la consulta cita")
      } else {
          tabla.Delet(columna, cedula, (error, results) => {
              //connection.query(`DELETE FROM mascotas WHERE cedula_duenio=${cedula}`, (error, results) => {
              if (error) {
                  console.log("Error en la consulta", error)
                  res.status(500).send("Error en la consulta paciente")
              } else {
                  res.redirect('/pacientes')
              }
          });
      }
  });
});

router.post('/actualizar/:cedula', (req, res) => {
  const cedula = req.params.cedula;

  //Para la funsion StringUpdate, El name de los inputs en el HTML deben tener el mismo nombre que el encabezado de las columnas en la base de dat

  const datos = funsiones.StringUpdate(req.body)
  console.log(datos)
  const strWhere = 'cedula_paciente=' + req.params.cedula;
  tabla.Update(datos, strWhere, (error, results) => {
    //connection.query(`UPDATE medicos SET nombres='${nombres}', apellidos='${apellidos}', especialidad='${especialidad}', consultorio=${consultorio}, correo='${correo}' WHERE cedula=${cedula}`, (error, result) => {
    if (error) {
      console.log("Ocurrio un error en la ejecución", error)
      res.status(500).send("Error en la consulta");
    } else {
      res.redirect('/pacientes');
    }
  });
})

module.exports = router;