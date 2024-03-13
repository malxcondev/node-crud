const express = require('express');
//mongoose para la conexión con la base de datos MongoDB
const mongoose = require('mongoose');
//body-parser para analizar los cuerpos de las solicitudes HTTP
const bodyParser = require('body-parser');
//dotenv para cargar las variables de entorno desde un archivo .env.
const {config} = require('dotenv');
config()

const bookRoutes = require('./routes/book.router.js');


//Usamos express par alos middlewares
const app = express();
//Se usa body-parser para analizar los cuerpos de las solicitudes entrantes en formato JSON.
app.use(bodyParser.json());

//Conectamos la base de datos
//Se utiliza mongoose.connect() para establecer una conexión con la base de datos MongoDB.
//Utliza 2 parametros (Url de conexion a bd, nombre de la bd)
mongoose.connect(process.env.MONGO_URL,{dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;

app.use('/books', bookRoutes)

//Se define el puerto que se ejecutara en el servidor
const port = process.env.PORT || 3000;

//Se llama al metodo app.listen para iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

