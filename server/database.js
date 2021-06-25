const mysql = require('mysql');

const conn = mysql.createConnection(
{
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'acds'
});

conn.connect(err =>
{
    if (err)
        console.log(err);
});

async function registerPlayerData(playerID)
{
    let sql = 'SELECT characteristic_id FROM characteristic';

    conn.query(sql, null, (err, results) =>
    {
        results.forEach(characteristicID =>
        {
            sql = 'INSERT INTO player_characteristic (player_id, characteristic_id, value) VALUES (?, ?, 0)';
            let post = [playerID, characteristicID.characteristic_id];
            conn.query(sql, post);
        });
    });

    sql = 'SELECT attribute_id FROM attribute';

    conn.query(sql, null, (err, results) =>
    {
        results.forEach(attributeID =>
        {
            sql = 'INSERT INTO player_attribute (player_id, attribute_id, value) VALUES (?, ?, 0)';
            let post = [playerID, attributeID.attribute_id];
            conn.query(sql, post);
        });
    });

    sql = 'SELECT attribute_status_id FROM attribute_status';

    conn.query(sql, null, (err, results) =>
    {
        results.forEach(attributeStatusID =>
        {
            sql = 'INSERT INTO player_attribute_status (player_id, attribute_status_id, value) VALUES (?, ?, FALSE)';
            let post = [playerID, attributeStatusID.attribute_status_id];
            conn.query(sql, post);
        });
    });


    sql = 'SELECT skill_id, start_value, mandatory FROM skill';
    
    conn.query(sql, null, (err, results) =>
    {
        results.forEach(skill =>
        {
            if (!skill.mandatory)
                return;
            sql = 'INSERT INTO player_skill (player_id, skill_id, value, player_skill.checked) VALUES (?, ?, ?, FALSE)';
            let post = [playerID, skill.skill_id, skill.start_value];
            conn.query(sql, post);
        });
    });
    

    sql = 'SELECT spec_id FROM spec';

    conn.query(sql, null, (err, results) =>
    {
        results.forEach(combatSpecID =>
        {
            sql = 'INSERT INTO player_spec (player_id, spec_id, value) VALUES (?, ?, \'0\')';
            let post = [playerID, combatSpecID.spec_id];
            conn.query(sql, post);
        });
    });

    sql = 'SELECT info_id FROM info';

    conn.query(sql, null, (err, results) =>
    {
        results.forEach(infoID =>
        {
            sql = 'INSERT INTO player_info (player_id, info_id, value) VALUES (?, ?, \'\')';
            let post = [playerID, infoID.info_id];
            conn.query(sql, post);
        });
    });

    sql = "INSERT INTO player_equipment (equipment_id, player_id, player_equipment.using, current_ammo) VALUES ((SELECT equipment.equipment_id FROM equipment WHERE equipment.name = 'Desarmado'), ?, FALSE, '-')";
    conn.query(sql, [playerID]);
}

function promiseQuery(sql, post)
{
    return new Promise((resolve, reject) =>
    {
        conn.query(sql, post, (err, res) =>
        {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
}

module.exports.query = (sql, post, callback) =>
{
    return conn.query(sql, post, callback);
};
module.exports.promiseQuery = promiseQuery;
module.exports.registerPlayerData = registerPlayerData;