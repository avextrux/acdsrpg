const server = require('./server');
const express = server.express;
const router = express.Router();
const RandomOrg = require('random-org');
const apiKey = process.env.RANDOM_ORG_KEY;
const random = new RandomOrg({apiKey: apiKey});

function nextInt(min, max, n)
{
    return random.generateIntegers({ min: min, max: max, n: n});
}

router.get('/single', (req, res) =>
{
    let max = req.query.max;

    if (max <= 1)
    {
        res.send({num:1});
        return;
    }

    nextInt(1, max, 1).then(result =>
    {
        res.send({num:result.random.data[0]});
    });
});

router.get('/multiple', (req, res) =>
{
    let dices = req.query.dices;
    
    let results = new Array(dices.length);
    let finishedLength = 0;

    let totalSum = 0;
    
    for (let i = 0; i < dices.length; i++)
    {
        const dice = dices[i];
        let n = parseInt(dice.n);
        let num = parseInt(dice.num);

        if (n === 0 || num <= 1)
        {
            results[i] = num;
            totalSum += num;
            finishedLength++;
            continue;
        }

        nextInt(1, num, n).then(result =>
        {
            let data = result.random.data;
    
            let tempSum = 0;
            data.forEach(el =>
            {
                tempSum += el;
                totalSum += el;
            });

            results[i] = tempSum;
            finishedLength++;

            if (finishedLength === dices.length)
                res.send({results: results, sum: totalSum});
        });
    }
});

module.exports = router;