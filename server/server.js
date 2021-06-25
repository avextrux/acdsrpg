const express = require('express');
const app = express();
const { Server } = require("socket.io");
const hbs = require('hbs');
const http = require('http');
const path = require('path');

const viewsPath = path.join(__dirname, '../templates/views');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 80;

const sessions = new Map();
const disconnectingSessions = new Map();

io.on('connection', socket =>
{
    let address = socket.handshake.address;
    let timeout = disconnectingSessions.get(address);
    if (timeout)
    {
        clearTimeout(timeout);
        disconnectingSessions.delete(address);
    }
    
    socket.on('disconnect', reason =>
    {
        let closeSessionTimeout = setTimeout(() =>
        {
            sessions.delete(address);
            disconnectingSessions.delete(address);
        }, 10000);
        disconnectingSessions.set(address, closeSessionTimeout);
    });
});

function start()
{
    server.listen(port, () =>
    {
        console.log(`Listening to port ${port}...`);
    });
}

function isSessionActive(address)
{
    if (address === undefined)
        return false;
    return sessions.get(address) !== undefined;
}

function isSessionIDActive(id)
{
    for (sID in sessions.values())
    {
        if (sID === id)
            return true;
    }
    return false;
}

function getSession(address)
{
    return sessions.get(address);
}

function setSessionActive(active, address, id = -1)
{
    if (active)
        return sessions.set(address, id);
    else
        return sessions.delete(address);
}

module.exports.app = app;
module.exports.io = io;
module.exports.getSession = getSession;
module.exports.isSessionIDActive = isSessionIDActive;
module.exports.isSessionActive = isSessionActive;
module.exports.setSessionActive = setSessionActive;
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