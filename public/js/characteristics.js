let characteristicOldText = '0';

function characteristicInput(id, element)
{
    if (isNaN(element.value))
    {
        console.log(characteristicOldText)
        element.value = characteristicOldText;
        return;
    }

    let text = element.value;

    $.ajax('/sheet/player/characteristic',
    {
        method: 'POST',
        data: {playerID: playerID, characteristicID: id, value: text},
        success: data => characteristicOldText = text,
        error: err =>
        {
            element.value = characteristicOldText;
            console.log(err);
            failureToast.show();
        }
    });
}

function characteristicDiceClick(input)
{
    diceRoll.show();
    let num = input.value;
    rollDice(num);
}