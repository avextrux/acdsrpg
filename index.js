const server = require('./server/server');
const app = server.app;

app.get('*', (req, res) =>
{
    res.send('404 Not Found');
});

server.start();