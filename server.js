const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postsRoutes');
const userRoutes = require('./src/routes/userRoutes');
const conversationsRoutes = require('./src/routes/conversationsRoutes')
const messagesRoutes = require('./src/routes/messagesRoutes')
const projectsRoutes = require('./src/routes/projectsRoutes');
const {getCovers} = require('./src/controllers/dataController')
const {dbConnection} = require('./src/config/db')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require ('dotenv').config();
const PORT = process.env.PORT;

dbConnection();

app.use(cors());

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
});

// Configuración body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectsRoutes);
app.get('/covers', getCovers);
app.use('/conversations', conversationsRoutes)
app.use('/messages', messagesRoutes)

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);
    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data);
        io.emit('mensaje', data);
    });
});

server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))