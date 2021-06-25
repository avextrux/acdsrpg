

function basicInfoInput(id, element)
{
    let text = element.value;

    $.ajax('/sheet/player/info',
    {
        method: 'POST',
        data: {playerID: playerID, infoID: id, value: text},
        error: err =>
        {
            element.value = basicInfoOldText;
            console.log(err);
            failureToast.show();
        }
    });
}