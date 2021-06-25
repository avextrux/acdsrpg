const encrypter = require('./encrypter');
const db = require('./database');
const bodyParser = require('body-parser');
const server = require('./server');
const express = server.express;
const router = express.Router();
var urlParser = bodyParser.urlencoded({extended:false});

const path = require('path');
const fs = require('fs');

router.get('/', (req, res) =>
{
    res.render('register');
});

router.get('/keeper', (req, res) =>
{
    res.render('register',
    {
        keeper: true
    });
})

router.post('/', urlParser, (req, res) =>
{
    registerPost(req, res); 
});

router.post('/keeper', urlParser, (req, res) =>
{
    registerPost(req, res);
});

async function registerPost(req, res)
{
    let username = req.body.login;
    let password = req.body.password;

    let keeperKey = parseInt(req.body.keeperKey);

    let sql = 'SELECT login FROM player WHERE login = ?';

    let results = await db.promiseQuery(sql, [username]);

    if (results.length > 0)
    {
        res.render('register',
        {
            color: 'red',
            message: `Esse login já existe.`
        });
        return;
    }

    let type = 'investigator';

    if (!(isNaN(keeperKey)))
    {
        sql = 'SELECT * FROM keeper_key';
        results = await db.promiseQuery(sql);
        let key = parseInt(results[0].id);
        
        if (key === keeperKey)
            type = 'keeper';
        else
        {
            res.render('register',
            {
                keeper: true,
                color: 'red',
                message: `Chave de mestre incorreta.`
            });
            return;
        }
    }
    
    let hash = await encrypter.encrypt(password);
    
    sql = 'INSERT INTO player(player_type_id, login, password) VALUES ((SELECT player_type_id FROM player_type WHERE name = ?), ?, ?);';
    let post = [type, username, hash];

    await db.promiseQuery(sql, post);

    if (type === 'investigator')
    {
        sql = 'SELECT player_id FROM player WHERE login=?';

        results = await db.promiseQuery(sql, [username]);

        let id = results[0].player_id;
        
        db.registerPlayerData(id);
    }
    
    res.render('register',
    {
        color: 'green',
        message: 'Conta criada com sucesso! Você será redirecionado para a página de login em instantes...',
        redirectTime: 2500
    });
}

module.exports = router;