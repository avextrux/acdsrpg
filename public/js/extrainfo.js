const failureToast = new bootstrap.Toast(document.getElementById('failureToast'), {delay: 5000});

function infoInput(id, txt)
{
    let text = txt.value;

    $.ajax('/sheet/player/info',
    {
        method: 'POST',
        data: {playerID: playerID, infoID: id, value: text},
        error: err =>
        {
            console.log(err);
            failureToast.show();
        }
    });
}