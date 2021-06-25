const server = require('./server');
const express = server.express;
const router = express.Router();
const io = server.io;

const bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({extended:false});

const db = require('./database');

let sheetData;
const dataLength = 15;

const disconnectingSessions = new Map();

router.get('/1', (req, res) =>
{
    let session = req.session;
    let playerID = session.playerID;

    if (!playerID)
    {
        return res.render('rejected',
        {
            message: 'Sessão não está ativa. Você se esqueceu de logar?'
        });
    }

    sheetData = {sheet_id: playerID};

    let sql = "SELECT info.info_id, info.name, player_info.value  " +
    "FROM info, player_info  " +
    "WHERE info.info_id = player_info.info_id AND player_info.player_id = ?";
    let post = [playerID];

    db.query(sql, post, (err, info) =>
    {
        if (err)
            console.log(err);
        let basicInfo = info.slice(0, 9);
        sheetData['info'] = basicInfo;
        let extraInfo = info.slice(9);
        let money = extraInfo.find(a => a.name === 'Dinheiro');
        let dailyMoney = extraInfo.find(a => a.name === 'Nível de Gasto Diário');
        sheetData['money'] = money;
        sheetData['dailyMoney'] = dailyMoney;

        checkSendSheet(res);
    });

    sql = "SELECT attribute.attribute_id, attribute.name, attribute.rollable, attribute.bg_color, attribute.fill_color, " +
    "player_attribute.value, player_attribute.max_value " +
    "FROM attribute, player_attribute " +
    "WHERE attribute.attribute_id = player_attribute.attribute_id AND player_attribute.player_id = ?";

    db.query(sql, post, (err, attributes) =>
    {
        sql = "SELECT attribute_status.attribute_status_id, attribute_status.attribute_id, attribute_status.name, player_attribute_status.value " +
        "FROM attribute_status, player_attribute_status " +
        "WHERE attribute_status.attribute_status_id = player_attribute_status.attribute_status_id AND player_attribute_status.player_id = ?";
        db.query(sql, post, (err1, status) =>
        {
            for (let i = 0; i < attributes.length; i++)
            {
                const attr = attributes[i];
                attr.status = [];
                let cur = attr.value;
                let max = attr.max_value;
                if (cur === 0)
                    attr.coeficient = 0;
                else
                    attr.coeficient = Math.min((cur / max) * 100, 100);

                for (let i = 0; i < status.length; i++)
                {
                    const stat = status[i];
                    if (stat.value)
                        stat.checked = 'checked';
                    if (stat.attribute_id === attr.attribute_id)
                        attr.status.push(stat);
                }
            }
            sheetData['attributes'] = attributes;
            checkSendSheet(res);
        });
    });

    sql = "SELECT characteristic.characteristic_id, characteristic.name, characteristic.rollable, player_characteristic.value " +
    "FROM characteristic, player_characteristic " +
    "WHERE characteristic.characteristic_id = player_characteristic.characteristic_id AND player_characteristic.player_id = ?";

    fillSheet(res, sql, post, 'characteristics');

    sql = "SELECT skill.skill_id, specialization.name " +
    "FROM skill, specialization " +
    "WHERE skill.specialization_id = specialization.specialization_id";

    db.query(sql, post, (err, specializedSkills) =>
    {
        sql = "SELECT skill.skill_id, skill.name, player_skill.value, player_skill.checked " +
        "FROM skill, player_skill " +
        "WHERE skill.skill_id = player_skill.skill_id AND player_skill.player_id = ?";
        db.query(sql, post, (err, skills) =>
        {
            for (let i = 0; i < skills.length; i++)
            {
                const skill = skills[i];
                let id = skill.skill_id;
                let skillName = skill.name;
                specializedSkills.forEach(specSkill =>
                {
                    if (specSkill.skill_id !== id)
                        return;
                    skills[i].name = `${specSkill.name} (${skillName})`;
                });
            }
            skills.sort((a,b) => a.name.localeCompare(b.name));

            sheetData['skills'] = skills;
            checkSendSheet(res);
        });
    });

    sql = "SELECT equipment.equipment_id, skill.name AS skill_name, equipment.name, equipment.damage, " +
    "equipment.range, equipment.attacks, equipment.ammo, equipment.malfunc, player_equipment.using, player_equipment.current_ammo " +
    "FROM equipment, skill, player_equipment " +
    "WHERE skill.skill_id = equipment.skill_id AND equipment.equipment_id = player_equipment.equipment_id AND player_equipment.player_id = ?";

    db.query(sql, post, (err, equipments) =>
    {
        for (let i = 0; i < equipments.length; i++)
        {
            const eq = equipments[i];
            if (eq.using)
                eq.checked = 'checked';
        }
        sheetData['equipments'] = equipments;
        checkSendSheet(res);
    });

    sql = "SELECT spec.spec_id, spec.name, player_spec.value " +
    "FROM spec, player_spec " +
    "WHERE spec.spec_id = player_spec.spec_id AND player_spec.player_id = ?";

    fillSheet(res, sql, post, 'specs');

    sql = "SELECT item.item_id, item.name, item.description " +
    "FROM item, player_item " +
    "WHERE item.item_id = player_item.item_id AND player_item.player_id = ?";
    
    fillSheet(res, sql, post, 'items');

    sql = "SELECT skill_id, name FROM skill WHERE skill_id NOT IN (SELECT skill_id FROM player_skill WHERE player_id = ?)";

    fillSheet(res, sql, post, 'availableSkills');

    sql = "SELECT item_id, name FROM item WHERE item_id NOT IN (SELECT item_id FROM player_item WHERE player_id = ?)";

    fillSheet(res, sql, post, 'availableItems');

    sql = "SELECT equipment_id, name FROM equipment WHERE equipment_id NOT IN (SELECT equipment_id FROM player_equipment WHERE player_id = ?)";

    fillSheet(res, sql, post, 'availableEquipments');
    
    sql = "SELECT specialization_id, name FROM specialization";

    fillSheet(res, sql, post, 'specializations');

    sql = "SELECT skill.name, skill.skill_id FROM skill, specialization WHERE skill.specialization_id = specialization.specialization_id AND (specialization.name = 'Lutar' OR specialization.name = 'Armas de Fogo')";

    fillSheet(res, sql, post, 'combatSpecializations');
});

function fillSheet(res, sql, post, prop)
{
    db.query(sql, post, (err, result) =>
    {
        if (err)
        {
            console.log(err);
            return;
        }

        sheetData[prop] = result;
        checkSendSheet(res);
    });
}

function checkSendSheet(res)
{
    if (Object.keys(sheetData).length < dataLength)
        return;
    res.render('sheet', sheetData);
}

router.get('/2', async function (req, res)
{
    let playerID = session.playerID;

    let sql = "SELECT info.info_id, info.name, player_info.value  " +
    "FROM info, player_info  " +
    "WHERE info.info_id = player_info.info_id AND player_info.player_id = ?";
    let post = [playerID];

    let info = await db.promiseQuery(sql, post).catch(err => {console.log(err)});
    let aux = info.slice(0, 9);
    let extraInfo = info.slice(9);
    info = aux;

    res.render('sheetextras',
    {
        info: extraInfo,
        sheet_id: playerID
    });
});

router.post('/player/info', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let infoID = req.body.infoID;
    let value = req.body.value;

    let sql = "UPDATE player_info SET value = ? WHERE player_id = ? AND info_id = ?";
    let post = [value, playerID, infoID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);

    if (code !== 200)
        return;
    io.emit('info changed', {playerID, infoID, value});
});

router.put('/player/equipment', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let equipmentID = req.body.equipmentID;

    let sql = "INSERT INTO player_equipment (player_id, equipment_id, current_ammo, player_equipment.using) VALUES (?, ?, '-', FALSE)";
    let post = [playerID, equipmentID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.delete('/player/equipment', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let equipmentID = req.body.equipmentID;

    let sql = "DELETE FROM player_equipment WHERE player_id = ? AND equipment_id = ?";
    let post = [playerID, equipmentID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.post('/player/equipment', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let equipmentID = req.body.equipmentID;
    let using = req.body.using === 'true' ? 1 : 0;
    let currentAmmo = req.body.currentAmmo;

    let sql = 'UPDATE player_equipment SET player_equipment.using = ?, current_ammo = ? WHERE player_id = ? AND equipment_id = ?';
    let post = [using, currentAmmo, playerID, equipmentID];
    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.put('/equipment', urlParser, async function (req, res)
{
    let name = req.body.name;
    let skillID = req.body.skillID;
    let dmg = req.body.damage;
    let range = req.body.range;
    let atk = req.body.attacks;
    let ammo = req.body.ammo;
    let malf = req.body.malf;

    let sql = "INSERT INTO equipment (name, skill_id, damage, equipment.range, attacks, ammo, malfunc) VALUES (?, ?, ?, ?, ?, ?, ?)";
    let post = [name, skillID, dmg, range, atk, ammo, malf];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});


router.put('/player/skill', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let skillID = req.body.skillID;

    let sql = 'INSERT INTO player_skill (player_id, skill_id, value, checked) VALUES (?, ?, (SELECT start_value FROM skill WHERE skill_id = ?), FALSE)';
    let post = [playerID, skillID, skillID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.post('/player/skill', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let skillID = req.body.skillID;
    let value = req.body.value;
    let checked = req.body.checked === 'true' ? 1 : 0;

    let sql = 'UPDATE player_skill SET value = ?, checked = ? WHERE player_id = ? AND skill_id = ?';
    let post = [value, checked,  playerID, skillID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.put('/skill', urlParser, async function (req, res) 
{
    let specID = req.body.specializationID;
    if (specID === '')
        specID = null;
    let skillName = req.body.skillName;

    let sql = 'INSERT INTO skill (specialization_id, name, mandatory, start_value) VALUES (?, ?, FALSE, 0)';

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, [specID, skillName]).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.put('/player/item', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let itemID = req.body.itemID;

    let sql = 'INSERT INTO player_item (player_id, item_id) VALUES (?, ?)';

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, [playerID, itemID]).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);

    if (code !== 200)
        return;

    sql = 'SELECT name FROM item WHERE item_id = ?';
    result = await db.promiseQuery(sql, [itemID]);
    let name = result[0].name;
    io.emit('new item', {playerID, itemID, name});
});

router.delete('/player/item', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let itemID = req.body.itemID;

    let sql = 'DELETE FROM player_item WHERE player_id = ? AND item_id = ?';

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, [playerID, itemID]).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);

    if (code !== 200)
        return;
    
    io.emit('delete item', {playerID, itemID});
});

router.put('/item', urlParser, async function (req, res)
{
    let name = req.body.name;
    let desc = req.body.description;

    let sql = 'INSERT INTO item (name, description) VALUES (?, ?)';
    let post = [name, desc];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.post('/player/info', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let infoID = req.body.infoID;
    let value = req.body.value;

    let sql = 'UPDATE player_info SET value=? WHERE player_id = ? AND info_id = ?';
    let post = [value, playerID, infoID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.post('/player/attribute', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let attrID = req.body.attributeID;
    let value = req.body.value;
    let maxValue = req.body.maxValue;

    let sql = 'UPDATE player_attribute SET value=?, max_value=? WHERE player_id = ? AND attribute_id = ?';
    let post = [value, maxValue, playerID, attrID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);

    if (code !== 200)
        return;
    io.emit('attribute changed', {playerID, attributeID: attrID, value, maxValue});
});

router.post('/player/spec', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let specID = req.body.specID;
    let value = req.body.value;

    let sql = 'UPDATE player_spec SET value=? WHERE player_id = ? AND spec_id = ?';
    let post = [value, playerID, specID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.post('/player/characteristic', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let charID = req.body.characteristicID;
    let value = req.body.value;

    let sql = 'UPDATE player_characteristic SET value=? WHERE player_id = ? AND characteristic_id = ?';
    let post = [value, playerID, charID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
    
    if (code !== 200)
        return;
    
    io.emit('char changed', {playerID, charID, value});
});

router.post('/player/attributestatus', urlParser, async function (req, res)
{
    let playerID = req.body.playerID;
    let attrStatusID = req.body.attributeStatusID;
    let checked = req.body.checked === 'true' ? 1 : 0;

    let sql = 'UPDATE player_attribute_status SET value = ? WHERE player_id = ? AND attribute_status_id = ?';
    let post = [checked, playerID, attrStatusID];

    let code = 200;
    let result;
    result = await db.promiseQuery(sql, post).catch(err => {code = 500, result = err; console.log(err);});
    res.status(code).send(result);
});

router.get('/player/session/retake', (req, res) =>
{
    let playerID = req.session.playerID;

    console.log('RECALL ' + playerID);
    let disconnecting = disconnectingSessions.get(playerID);
    if (disconnecting)
    {
        console.log('RECONNECTED ' + playerID);
        clearTimeout(disconnecting);
    }
    disconnectingSessions.delete(playerID);

    res.status(200).send('ok');
});

router.get('/player/session/destroy', (req, res) =>
{
    let playerID = req.session.playerID;

    if (playerID === undefined)
        return res.status(204).send('');

    console.log('DISCONNECTING ' + playerID);
    let disconnecting = setTimeout(() =>
    {
        req.session.destroy();
        disconnectingSessions.delete(playerID);
        console.log(playerID + " DISCONNECTED");
    }, 5000);

    disconnectingSessions.set(playerID, disconnecting);

    res.status(200).send('ok');
});

module.exports = router;