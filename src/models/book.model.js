//Se importa la biblioteca mongoose, que es una herramienta de modelado de objetos para MongoDB en Node.js.
const mongoose = require('mongoose');

//Se define un esquema de libro utilizando mongoose.Schema()
const bookSchema = new mongoose.Schema({
  title: String,
  author:String,
  genre: String,
  publicacion_date: String,
});

module.exports = mongoose.model('Book', bookSchema);
/*
Se exporta el esquema de libro como un modelo de Mongoose
 utilizando mongoose.model(). Un modelo en Mongoose es una 
 clase que se utiliza para realizar operaciones CRUD 
 (Crear, Leer, Actualizar, Eliminar) en la colección asociada 
 en la base de datos.
*/
