const server = require('./server');
const express = server.express;
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
//cloudinary.config(process.env.CLOUDINARY_URL);


const bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({extended:false});

router.get('/def', (req, res) =>
{
    loadAvatar(req, res, 'def');
});

router.get('/insane', (req, res) =>
{
    loadAvatar(req, res, 'insane');
});

router.get('/unconscious', (req, res) =>
{
    loadAvatar(req, res, 'unconscious');
});

router.get('/mw', (req, res) =>
{
    loadAvatar(req, res, 'mw');
});

router.get('/mwinsane', (req, res) =>
{
    loadAvatar(req, res, 'mwinsane');
});

const form = formidable({multiples: true}); 
const names = ['def', 'unconscious', 'mw', 'insane', 'mwinsane'];
router.post('/player', urlParser, async function (req, res)
{
    let parsed = await new Promise((resolve, reject) =>
    {
        form.parse(req, (err, fields, obj) =>
        {
            if (err)
            {
                res.status(500).send('Error on parsing files.');
                console.log(err);
                reject(err);
                return;
            }
            resolve({fields, obj});
        });
    });

    const id = parsed.fields.id;
    const files = parsed.obj.file;
    let count = 0;
    for (let i = 0; i < files.length; i++)
    {
        const file = files[i];
        const name = names[i];
        cloudinary.uploader.upload(file.path,
        {
           folder: `${id}/`,
           format: 'jpg',
           filename_override: `${name}.jpg`,
           unique_filename: false,
           use_filename: true,
           async: true
        }, (result, err) =>
        {
            count++;
            if (count === files.length)
                res.status(200).send('');
        });
    }
});

function loadAvatar(req, res, name)
{
    let id = req.session.playerID;
    let url = cloudinary.url(`${id}/${name}`, {secure: true});
    res.send({url});
}

module.exports = router;