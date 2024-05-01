const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

const cors = require('cors');

const io = socketIo(server, {
    cors: {
        origin: "https://the-lazy-coder.netlify.app"
    }
});

//Routes
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postsRoutes');
const userRoutes = require('./src/routes/userRoutes');
const conversationsRoutes = require('./src/routes/conversationsRoutes')
const messagesRoutes = require('./src/routes/messagesRoutes')
const projectsRoutes = require('./src/routes/projectsRoutes');
const {getCovers} = require('./src/controllers/dataController')


const {dbConnection} = require('./src/config/db')
const bodyParser = require('body-parser');

const path = require('path');

require ('dotenv').config();
const PORT = process.env.PORT;

dbConnection();

app.use(cors());

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

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {

  console.log("a user connected.");


  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))