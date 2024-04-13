const express = require('express')
const app = express();
const authRoutes = require('./src/routes/authRoutes')
const postRoutes = require('./src/routes/postsRoutes')
const userRoutes = require('./src/routes/userRoutes')
const {dbConnection} = require('./src/config/db')
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors')

require ('dotenv').config();
const PORT = process.env.PORT;

dbConnection();

app.use(cors());

// Configuración body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes) 

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))