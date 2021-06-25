const encrypter = require('./encrypter');
const db = require('./database');
const bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({extended:false});
const server = require('./server');
const express = server.express;
const router = express.Router();

router.get('/', (req, res) =>
{
    res.render('login');
});

router.post('/', urlParser, async function (req, res)
{
    let username = req.body.login;
    let password = req.body.password;

    let sql = 'SELECT player.player_id, player.password, player_type.name FROM player, player_type WHERE login=? AND player.player_type_id = player_type.player_type_id';

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, [username]).catch(err => {code = 500, result = err; console.log(err);});
    
    if (result.length <= 0)
    {
        res.status(code).render('login',
        {
            showMessage: true,
            color: 'red',
            message: 'Login ou senha incorretos.'
        });
        return;
    }

    let hashword = result[0].password;
    let id = result[0].player_id;
    let exists = await encrypter.compare(password, hashword).catch(err => {code = 500, result = err; console.log(err);});

    if (!exists)
    {
        return res.render('login',
        {
            color: 'red',
            message: 'Login ou senha incorretos.'
        });
    }
    
    let session = req.session;

    if (session.playerID)
    {
        return res.render('login',
        {
            color: 'red',
            message: 'Usuário já está ativo.'
        });
    }
    
    session.playerID = id;

    if (result[0].name === 'keeper')
        return res.redirect('/keeper');
    res.redirect('/sheet/1');
})

module.exports = router;