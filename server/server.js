const express = require('express');
const app = express();
const { Server } = require("socket.io");
const http = require('http');
const path = require('path');
const session = require('express-session');

const viewsPath = path.join(__dirname, '../templates/views');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.static(publicPath));
app.use(session({secret: 'thisIsASecret', resave: false, saveUninitialized: false}));

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 80;

const sessions = [];
const disconnectingSessions = new Map();

function start()
{
    server.listen(port, () =>
    {
        console.log(`Listening to port ${port}...`);
    });
}

module.exports.app = app;
module.exports.io = io;
module.exports.sessions = sessions;
module.exports.disconnectingSessions = disconnectingSessions;
module.exports.express = express;
module.exports.start = start;

//Routes
const sheet = require('./sheet');
const login = require('./login');
const register = require('./register');
const dice = require('./dice');
const avatar = require('./avatars');
const keeper = require('./keeper');

app.use('/sheet', sheet);
app.use('/login', login);
app.use('/register', register);
app.use('/dice', dice);
app.use('/avatars', avatar);
app.use('/keeper', keeper);