const funsiones = require('../database/funsiones.js')
const consulta = require('../database/query.js')


const thMedicos = 'cedula,nombre,apellido,especialidad,consultorio,correo'
const thCitas = 'id_mascota, id_medico, fecha'

const myInfo = {
    cedulaMedico: '499988777',
    nombreMedico: 'Eduardo',
    apellidoMedico: 'clavijo',
    especialidad: 'General',
    consultorio: '102',
    correoMed: 'prueba@correo.com'
};
let datos = funsiones.StringAuto(myInfo)
//console.log(`El estring es ${datos}`)
let tabla1 = new consulta.consultas('medicos')
tabla1.Insert(thMedicos,datos,(error, results) => {
    if (error) {
        console.log("Error en la consulta 2")
        //res.status(500).send("Error en la consulta")
    } else {
        //res.render('mascotas', { title: 'mascotas', mascotas: results, opcion: 'disabled', estado: true })
        console.log('Registro exitoso')
    }
});