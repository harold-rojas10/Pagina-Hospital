var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')
const tabla = new consulta.consultas('medicos')
const columnaCita = "id_medico" //Nombre de la columna que posee la llave foranea entre la tabla de citas y medicos


router.get('/', function (req, res, next) {
    tabla.select("*", (error, results) => {
        console.log(results)
        if (error) {
            res.locals.message = "Error en la consulta <br>" + error;
            console.log("Error en la consulta", error)
            res.status(500).render('error')
        } else {
            res.render('medicos', { title: 'medicos', title2: 'MEDICOS REGISTRADOS', medicos: results, opcion: 'disabled', estado: true })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    tabla.select("*", (error, results) => {
        if (error) {
            res.locals.message = "Error en la consulta <br>" + error;
            console.log("Error en la consulta", error)
            res.status(500).render('error')
        } else {
            res.render('medicos', { title: 'medicos', title2: 'MEDICOS REGISTRADOS', claveSeleccionada: clave, medicos: results, opcion: 'disabled', estado: false })
        }
    });
});
//Agregar Medico
router.get('/agregar-medico', function (req, res, next) {
    tabla.select("especialidad", (error, results) => {
        if (error) {
            res.locals.message = "Error en la consulta <br>" + error;
            console.log("Error en la consulta", error)
            res.status(500).render('error')
        } else {
            let especialidades = ['Medicina general', 'Cardiología', 'Medicina interna', 'Dermatología', 'Rehabilitación física', 'Psicología', 'Odontología', 'Radiología']
            let resultsEspecialidades = results.map(objeto => objeto.especialidad);//separar packete 
            let resultsSinRepetidos = especialidades.filter((elemento) => {//filtrar repetidos
                return !resultsEspecialidades.includes(elemento);
            });
            res.render('registro-medicos', { title: 'medicos',layout: 'registro', especialidades: resultsSinRepetidos })
        }
    });
});

router.post('/agregar', (req, res) => {
    const datos = funsiones.StringAuto(req.body)
    const thMedicos = 'nombre_medico,apellido_medico,cedula_medico,consultorio,correo,especialidad' //orden del formulario
    console.log(datos)
    tabla.Insert(thMedicos, datos, (error, results) => {
        if (error) {
            res.locals.message = "Error en la consulta <br>" + error;
            console.log("Error en la consulta", error)
            res.status(500).render('error')
        } else {
            res.redirect('/medicos');
        }
    });
})

//eliminar medicos
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    const columna = "cedula_medico"
    const tablaCita = new consulta.consultas('cita_medica')
    tablaCita.Delet(columnaCita, cedula, (error, results) => {
        if (error) {
            res.locals.message = "Error en la consulta <br>" + error;
            console.log("Error en la consulta", error)
            res.status(500).render('error')
        } else {
            tabla.Delet(columna, cedula, (error, results) => {
                //connection.query(`DELETE FROM mascotas WHERE cedula_duenio=${cedula}`, (error, results) => {
                if (error) {
                    res.locals.message = "Error en la consulta <br>" + error;
                    console.log("Error en la consulta", error)
                    res.status(500).render('error')
                } else {
                    res.redirect('/medicos')
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
    const strWhere = 'cedula_medico=' + req.params.cedula;
    tabla.Update(datos, strWhere, (error, results) => {
        //connection.query(`UPDATE medicos SET nombres='${nombres}', apellidos='${apellidos}', especialidad='${especialidad}', consultorio=${consultorio}, correo='${correo}' WHERE cedula=${cedula}`, (error, result) => {
        if (error) {
            res.locals.message = "Error en la consulta <br>" + error;
            console.log("Error en la consulta", error)
            res.status(500).render('error')
        } else {
            res.redirect('/medicos');
        }
    });
})

module.exports = router;
