const server = require('./server');
const express = server.express;
const router = express.Router();
const db = require('./database');

router.get('/', async function (req, res)
{
    let session = req.session;

    if (!session.address)
    {
        return res.render('rejected',
        {
            message: 'Sessão não está ativa. Você se esqueceu de logar?'
        });
    }

    let sql = "SELECT player_id, login FROM player WHERE player_type_id NOT IN (SELECT player_type_id FROM player_type WHERE name = 'keeper')";

    let characters = await db.promiseQuery(sql);

    let players = [];

    for (let i = 0; i < characters.length; i++)
    {
        const c = characters[i];
        let id = c.player_id;
        let avatar = `/avatars/def?id=${id}`;

        sql = "SELECT info_id, value FROM player_info WHERE player_id = ? AND info_id IN (SELECT info_id FROM info WHERE name = 'Nome')";
        let post = [id];

        let info = await db.promiseQuery(sql, post).catch(err => console.log(err));
        let name = info[0].value;
        if (name.length === 0)
            name = 'Desconhecido';
        let infoID = info[0].info_id;

        sql = "SELECT attribute.attribute_id, attribute.name, attribute.fill_color, player_attribute.value, player_attribute.max_value FROM attribute, player_attribute WHERE player_attribute.player_id = ? AND player_attribute.attribute_id = attribute.attribute_id";
        let attr = await db.promiseQuery(sql, post).catch(err => console.log(err));

        sql = "SELECT item.item_id, item.name FROM item, player_item WHERE item.item_id = player_item.item_id AND player_item.player_id = ?"
        let items = await db.promiseQuery(sql, post).catch(err => console.log(err));
        
        sql = "SELECT characteristic_id, value FROM player_characteristic WHERE player_id = ? AND characteristic_id IN (SELECT characteristic_id FROM characteristic WHERE name = 'Movimento')";
        let char = await db.quepromiseQueryry(sql, post).catch(err => console.log(err));
        let mov = char[0].value;
        let charID = char[0].characteristic_id;

        let player = 
        {
            playerID: id,
            avatar: avatar,
            name: name,
            infoID: infoID,
            attributes: attr,
            mov: mov,
            items: items,
            charID: charID
        };

        players.push(player);
    }

    res.render('keepersheet',
    {
        players: players
    });
});

module.exports = router;