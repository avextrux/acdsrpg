/****************
 *              *
 *  Attributes  *
 *              *
 ****************/

function attributeBarClick(id, bar, desc)
{
    let split = desc.textContent.split('/');
    let cur = parseInt(split[0]);
    let max = parseInt(split[1]);

    let newMax = prompt('Digite o novo máximo do atributo:', max);
    let newCur = clamp(cur, 0, newMax);
    
    if (isNaN(newMax))
        return;

    $.ajax('/sheet/player/attribute',
    {
        method: 'POST',
        data: {playerID: playerID, attributeID: id, value: newCur, maxValue: newMax},
        success : data =>
        {
            desc.textContent = `${newCur}/${newMax}`;
            resolveAttributeBar(newCur, newMax, bar);
        },
        error: err =>
        {
            console.log(err);
            failureToast.show();
        }
    });
}

function attributeIncreaseClick(ev, id, bar, desc)
{
    let diff = 1;
    if (ev.shiftKey)
        diff = 10;

    let split = desc.textContent.split('/');

    let cur = parseInt(split[0]);
    let max = parseInt(split[1]);
    let newCur = clamp(cur + diff, 0, max);

    desc.textContent = `${newCur}/${max}`;
    resolveAttributeBar(newCur, max, bar);

    $.ajax('/sheet/player/attribute',
    {
        method: 'POST',
        data: {playerID: playerID, attributeID: id, value: newCur, maxValue: max},
        error: err =>
        {
            desc.textContent = `${cur}/${max}`;
            resolveAttributeBar(cur, max, bar);
            console.log(err);
            failureToast.show();
        }
    });
}

function attributeDecreaseClick(ev, id, bar, desc)
{
    let diff = 1;
    if (ev.shiftKey)
        diff = 10;

    let split = desc.textContent.split('/');

    let cur = parseInt(split[0]);
    let max = parseInt(split[1]);
    let newCur = clamp(cur - diff, 0, max);

    desc.textContent = `${newCur}/${max}`;
    resolveAttributeBar(newCur, max, bar);

    $.ajax('/sheet/player/attribute',
    {
        method: 'POST',
        data: {playerID: playerID, attributeID: id, value: newCur, maxValue: max},
        error: err =>
        {
            desc.textContent = `${cur}/${max}`;
            resolveAttributeBar(cur, max, bar);
            console.log(err);
            failureToast.show();
        }
    });
}

function attributeDiceClick(desc)
{
    diceRoll.show();

    let split = desc.textContent.split('/');

    let cur = parseInt(split[0]);

    rollDice(cur, false);
}

function resolveAttributeBar(now, max, bar)
{
    let coeficient = (now / max) * 100;
    bar.style.width = `${coeficient}%`;
}

/*****************
 *               *
 *     Specs     *
 *               *
 *****************/
 
 function specInput(id, name, element)
 {
     let text = element.value;
    specs.set(name, text);
     $.ajax('/sheet/player/spec',
     {
         method: 'POST',
         data: {playerID: playerID, specID: id, value: text},
         error: err =>
         {
             console.log(err);
             failureToast.show();
         }
     });
 }

function clamp(n, min, max)
{
    if (n < min)
        return min;
    if (n > max)
        return max;
    return n;
}

const diceRollMax = 100;
const diceResultContent = document.getElementById('diceResultContent');
const diceResultDescription = document.getElementById('diceResultSuccess');
const goodRate = 0.5, extremeRate = 0.2;

const diceRollModal = document.getElementById('diceRoll');
const failureToast = new bootstrap.Toast(document.getElementById('failureToast'), {delay: 5000});

function rollDice(num = -1, showBranches = true)
{
    function onSuccess(data)
    {
        let roll = data.num;
        let successType = resolveSuccessType(num, roll, showBranches);

        document.getElementById("loader").style.display = "none";
        diceResultContent.textContent = roll;
        diceResultContent.style.display = "block";
        if (num !== -1)
        {
            diceResultDescription.textContent = successType;
            setTimeout(() => diceResultDescription.style.display = "block", 750);
        }
    }

    $.ajax('/dice/single', 
    {
        data: {max: diceRollMax},
        success: onSuccess
    });
}

function rollDices(dices)
{
    function onSuccess(data)
    {
        let sum = data.sum;
        let results = data.results;

        document.getElementById("loader").style.display = "none";
        diceResultContent.textContent = sum.toString();
        diceResultContent.style.display = "block";
        diceResultDescription.textContent = results.join(' + ');
        setTimeout(() => diceResultDescription.style.display = "block", 750);
    }

    $.ajax('/dice/multiple', 
    {
        data: {dices},
        success: onSuccess
    });
}


diceRollModal.addEventListener('hidden.bs.modal', ev =>
{
    document.getElementById("loader").style.display = "block";
    diceResultContent.textContent = '';
    diceResultContent.style.display = "none";
    diceResultDescription.textContent = '';
    diceResultDescription.style.display = "none";
})

function resolveSuccessType(num, roll, showBranches)
{
    if (showBranches)
    {
        if (roll === 100)
            return 'Desastre';
        if (roll === 1)
            return 'Perfeito';
        if (roll <= num * extremeRate)
            return 'Extremo';
        if (roll <= num * goodRate)
            return 'Bom';
    }
    if (roll <= num)
        return 'Sucesso';
    if (roll > num)
        return 'Fracasso';
}

function resolveDices(str)
{
    let dices = str.split('+');
    let arr = [];
    for (let i = 0; i < dices.length; i++)
    {
        const dice = dices[i];
        resolveDice(dice, arr);
    }
    return arr;
}

function resolveDice(dice, arr)
{
    if(dice.includes('db'))
        return resolveDice(specs.get('Dano Bônus'), arr);
    
    let n = 0, num;
    if (dice.includes('d'))
    {
        let split = dice.split('d');
        n = split[0];
        num = split[1];
        for (let i = 0; i < n; i++)
        {
            arr.push({n:'1', num});
        }
    }
    else
    {
        arr.push({n, num: dice});
    }
}

$(window).on('beforeunload', ev =>
{
    $.get('/sheet/player/session');
});