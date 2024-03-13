//importamos express
const express = require('express');
//creamos un nuevo enrutador
const router = express.Router();
//importamos el modelo
const Book = require('../models/book.model.js');

// middleware que se utiliza para obtener un libro por su ID
const getBook = async (req, res, next) => {
    //Aqui almacenaremos el libro de la busqueda
    let book;
    //Aqui obtenemos el id de los libros
    const { id } = req.params;
    //Verificamos si el ID proporcionado es válido utilizando una expresión regular.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El id del libro no es válido'
        });
    }
    //Si no se encuentra el libro mandamos un mensaje de error.
    try {
        // Utilizamos el método findById del modelo Book para buscar un libro en la base de datos por su ID.
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: 'El libro no existe'
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error.message
        });
    }
    //Si el libro se encuentra, lo adjuntamos al objeto de respuesta (res.book)
    res.book = book;
    //llamamos a la siguiente función de middleware.
    next();
};

// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        //Utilizamos el método find() del modelo Book para encontrar todos los libros en la base de datos.
        const books = await Book.find();

        console.log('GET ALL', books);
        //Si no se encuentran libros respondemos con un estado 204 
        if (books.length === 0) {
            return res.status(204).json([]);
        }
        //Si se encuentran libros los enviamos como respuesta en formato JSON.
        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while retrieving books.'
        });
    }
});

// Crear un nuevo libro
router.post('/', async (req, res) => {
    // Extraemos los datos del libro del cuerpo de la solicitud (req.body)
    const { title, author, genre, publicacion_date } = req.body;
    // Verificamos si alguno de los campos está vacío
    if (!title || !author || !genre || !publicacion_date) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios'
        });
    }
    // Creamos un nuevo objeto libro utilizando el modelo Book y los datos proporcionados.
    const book = new Book({
        title,
        author,
        genre,
        publicacion_date
    });

    try {
        //Utilizamos el método save() para guardar el nuevo libro en la base de datos.
        const newBook = await book.save();
        console.log(newBook);
        //Si la operación de guardado es exitosa, respondemos con un estado 201 (Creado) y el nuevo libro en formato JSON.
        res.status(201).json(newBook);
    } catch (error) {
        //Si ocurre algún error durante la creación del libro, respondemos con un estado 500 (Error del servidor) y un mensaje de error.
        res.status(500).json({
            message: error.message || 'An error occurred while creating the book.'
        });
    }
});

router.get('/:id', getBook, async (req, res) =>{
    res.json(res.book);
});


router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicacion_date = req.body.publicacion_date || book.publicacion_date;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(404).json({
            message: error.message || 'An error occurred while updating the book.'
        })
    }
});


router.patch('/:id', getBook, async (req, res) => {

    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publicacion_date) {
        res.status(400).json({
            message: 'Todos los campos son obligatorios - Titulo, Autor, genero y fecha de publicacion'
        })
    }

    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicacion_date = req.body.publicacion_date || book.publicacion_date;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(404).json({
            message: error.message || 'An error occurred while updating the book.'
        })
    }
});


router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} se ha eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while deleting the book.'
        })
    }
});

module.exports = router;
