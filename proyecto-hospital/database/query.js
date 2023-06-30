//var express = require('express');
const { connection } = require('./conexion.js')
const funsiones = require('./funsiones.js')

class consultas {
    constructor(tabla) {
        this.name = tabla;
    }
    select(columna,callback) {
        connection.query(`SELECT ${columna} FROM ${this.name}`, callback);
    }
    Insert(thtabla,newDatos,callback){
        
        connection.query(`INSERT INTO ${this.name} (${thtabla}) VALUES (${newDatos});`, callback);
    }

}

module.exports = { consultas }