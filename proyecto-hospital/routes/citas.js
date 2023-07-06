var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')
const tabla = new consulta.consultas('cita_medica')

/* GET users listing. */
router.get('/', function (req, res, next) {
  connection.query('SELECT cm.id,cm.fecha,cm.id_paciente, pac.nombre_paciente, med.nombre_medico, med.apellido_medico, med.consultorio FROM cita_medica cm, pacientes pac, medicos med WHERE cm.id_paciente = pac.cedula_paciente AND cm.id_medico= med.cedula_medico', (error, results) => {
    console.log(results)
    console.log('--------------------------')
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      res.render('citas', { title: 'citas', title2: 'CITAS PROGRAMADAS', citas: results, opcion: 'disabled', estado: true })
    }
  });
  //res.render('citas', { title: 'Cita', title2: 'CITAS PROGRAMADAS', opcion: 'disabled', estado: true });
});

//Ruta Formulario Registro Cita Medica
router.get('/agregar-cita', function (req, res, next) {
  let tabla = new consulta.consultas('pacientes')
  tabla.select("cedula_paciente", (error, results) => {
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      console.log(results)
      let tabla = new consulta.consultas('medicos')
      tabla.select("especialidad", (error, results2) => {
        //connection.query('SELECT especialidad FROM medicos', (error, results2) => {
        if (error) {
          res.locals.message = "Error en la consulta <br>" + error;
          console.log("Error en la consulta", error)
          res.status(500).render('error')
        } else {
          res.render('registro-citas', { layout: 'registro', pacientes: results, medicos: results2 })
        }
      });
    }
  });
});

//Accion del formulario de registro
router.post('/agregar', function (req, res, next) {
  const especialidad = req.body.especialidad;
  console.log(especialidad)
  connection.query(`SELECT cedula_medico FROM medicos WHERE especialidad='${especialidad}'`, (error, results) => {
    console.log(results)
    console.log('-------------')
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      const thCitas = 'id_paciente, id_medico, fecha'
      const citaInfo = {
        cedulaPaciente: req.body.cedula,
        cedulaMedico: results[0].cedula_medico,
        fecha: req.body.fecha
      };
      const datos = funsiones.StringAuto(citaInfo)
      console.log(datos)
      //connection.query(`INSERT INTO cita_medica (id_mascota, id_medico, fecha) VALUES (${cedulaDuenio},${cedulaMedico}, '${fecha}')`, (error, result) =>
      tabla.Insert(thCitas, datos, (error, results) => {
        if (error) {
          res.locals.message = "Error en la consulta <br>" + error;
          console.log("Error en la consulta", error)
          res.status(500).render('error')
        } else {
          res.redirect('/citas');
        }
      });
    }
  });
})

//eliminar citas
router.get('/eliminar/:id', function (req, res, next) {
  const id = req.params.id
  const columId = 'id'
  tabla.Delet(columId, id, (error, results) => {
    //connection.query(`DELETE FROM cita_medica WHERE id=${id}`, (error, results) => {
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      res.redirect('/citas')
    }
  });
});

//Ruta boton Editar
router.get('/enviar/:clave', function (req, res, next) {
  const clave = req.params.clave;
  connection.query('SELECT cm.id,cm.fecha,cm.id_paciente, pac.nombre_paciente, med.nombre_medico, med.apellido_medico, med.consultorio FROM cita_medica cm, pacientes pac, medicos med WHERE cm.id_paciente = pac.cedula_paciente AND cm.id_medico= med.cedula_medico', (error, results) => {
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      res.render('citas', { title: 'citas', title2: 'CITAS PROGRAMADAS', claveSeleccionada: clave, citas: results, opcion: 'disabled', estado: false })
    }
  });
});

//Ruta boton Enviar para actualizar
router.post('/actualizar/:id', (req, res) => {
  //Para la funsion StringUpdate, El name de los inputs en el HTML deben tener el mismo 
  //nombre que el encabezado de las columnas en la base de datos
  const datos = funsiones.StringUpdate(req.body)
  console.log(datos)
  const strWhere = 'id=' + req.params.id;
  tabla.Update(datos, strWhere, (error, results) => {
    if (error) {
      res.locals.message = "Error en la consulta <br>" + error;
      console.log("Error en la consulta", error)
      res.status(500).render('error')
    } else {
      res.redirect('/citas');
    }
  });
})

module.exports = router;