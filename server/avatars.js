const server = require('./server');
const express = server.express;
const router = express.Router();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

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

    try
    {
        const id = parsed.fields.id;
        const files = parsed.obj.file;

        const avatarsFile = path.join(__dirname, '..', `/avatars/${id}/`);
        try
        {
            let oldFiles = fs.readdirSync(avatarsFile);
            for (let i = 0; i < oldFiles.length; i++)
                fs.unlinkSync(path.join(avatarsFile, oldFiles[i]));
        }
        catch (err)
        {
            fs.mkdirSync(avatarsFile);
        }

        for (let i = 0; i < files.length; i++)
        {
            const file = files[i];
            const name = names[i];

            const oldPath = file.path;
            const newPath = path.join(__dirname, '..', `/avatars/${id}/${name}${path.extname(file.name)}`);

            fs.renameSync(oldPath, newPath);
        }

        res.send('200');
    }
    catch (err)
    {
        res.status(500).send('Error saving files.');
        console.log(err);
    }
    
});

function loadAvatar(req, res, name)
{
    try
    {
        let id = req.query.id;
        let p = path.join(__dirname, '..', `/avatars/${id}/`);
        let files = fs.readdirSync(p);
    
        for (let i = 0; i < files.length; i++)
        {
            const file = path.parse(files[i]);
            if (file.name === name)
            {
                p += file.base;
                continue;
            }
        }
        res.sendFile(p);
    }
    catch (err)
    {
        res.status(500).send('Could not load image');
    }
}

module.exports = router;