
const express = require('express');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Configuración de la sesión
app.use(session({
  secret: '5481yyyuhb&',
  resave: false,
  saveUninitialized: true
}));

// Conexión a la base de datos
MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) throw err;
  const db = client.db('DatosUsuario');
  const estudiantes = db.collection('estudiantes');

  // Ruta para el formulario de inicio de sesión
  app.get('/', (req, res) => {
    res.send(`
      <h1>Inicio de sesión</h1>
      <form action="/login" method="post">
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" name="usuario" required>
        <br>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Iniciar sesión</button>
      </form>
    `);
  });

  // Ruta para autenticar al usuario
  app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    const { usuario, password } = req.body;
    estudiantes.findOne({ usuario }, (err, estudiante) => {
      if (err) throw err;
      if (estudiante && estudiante.password === password) {
        req.session.usuario = estudiante.usuario;
        req.session.tipo = estudiante.tipo;
        res.redirect('/streaming');
      } else {
        res.send('Usuario o contraseña incorrectos');
      }
    });
  });

  // Ruta para el streaming (solo accesible para usuarios autenticados)
  app.get('/streaming', (req, res) => {
    if (req.session.usuario) {
      res.send(`
        <h1>Bienvenido al streaming, ${req.session.usuario}!</h1>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `);
    } else {
      res.redirect('/');
    }
  });

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
});