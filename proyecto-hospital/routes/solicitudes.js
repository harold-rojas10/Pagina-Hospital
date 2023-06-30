const funsiones = require('../database/funsiones.js')
const consulta = require('../database/query.js')


let tabla = new consulta.consultas('medicos')
tabla.select("*", (error, results) => {
    if (error) {
        console.log("Error en la consulta")
        //res.status(500).send("Error en la consulta")
    } else {
        //res.render('mascotas', { title: 'mascotas', mascotas: results, opcion: 'disabled', estado: true })
        results.forEach(medicos => {
            console.log(medicos)
        });

    }

});




