const boxes = [];
let def, unc, mw, ins, mwins;

const attributeStatus = document.getElementsByClassName('acds-attribute-status');

const defAvatarFile = document.getElementById('defAvatarFile');
const uncAvatarFile = document.getElementById('unconsciousAvatarFile');
const mwAvatarFile = document.getElementById('mwAvatarFile');
const insAvatarFile = document.getElementById('insaneAvatarFile');
const mwinsAvatarFile = document.getElementById('mwinsaneAvatarFile');

const uploadAvatarModal = new bootstrap.Modal(document.getElementById('uploadAvatar'));

const avatar = $('#avatar');
let oldSrc;

for (let i = 0; i < attributeStatus.length; i++)
{
    const stat = attributeStatus[i];
    boxes.push(stat);
}

let count = 0;
$.get(`/avatars/def`, data =>
{
    def = data.url;
    count++;
    if (count === 5)
        evaluateAvatar();
});

$.get(`/avatars/unconscious`, data =>
{
    unc = data.url;
    count++;
    if (count === 5)
        evaluateAvatar();
});

$.get(`/avatars/mw`, data =>
{
    mw = data.url;
    count++;
    if (count === 5)
        evaluateAvatar();
});

$.get(`/avatars/insane`, data =>
{
    ins = data.url;
    count++;
    if (count === 5)
        evaluateAvatar();
});

$.get(`/avatars/mwinsane`, data =>
{
    mwins = data.url;
    count++;
    if (count === 5)
        evaluateAvatar();
});

async function uploadAvatar(ev)
{
    ev.preventDefault();
    let formData = new FormData();
    formData.append('id', playerID);
    formData.append('file', defAvatarFile.files[0]);
    formData.append('file', uncAvatarFile.files[0]);
    formData.append('file', mwAvatarFile.files[0]);
    formData.append('file', insAvatarFile.files[0]);
    formData.append('file', mwinsAvatarFile.files[0]);

    $.ajax('/avatars/player',
    {
        method: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: data =>
        {
            let url = data.url;
            avatar.attr('src', url);
        },
        error: (err) =>
        {
            console.log(err);
            failureToast.show();
        }
    });
    
    uploadAvatarModal.hide();
}

function attributeStatusChange(id, check)
{
    evaluateAvatar();
    $.ajax('/sheet/player/attributestatus',
    {
        method: 'POST',
        data: {playerID: playerID, attributeStatusID: id, checked: check.checked},
        error: (err) =>
        {
            console.log(err);
            check.checked = !check.checked;
            failureToast.show();
        }
    });
}

function evaluateAvatar()
{
    if (boxes[0].checked)
        avatar.attr('src', unc);
    else if (boxes[1].checked)
        if (boxes[2].checked || boxes[3].checked)
            avatar.attr('src', mwins);
        else
            avatar.attr('src', mw);
    else if (boxes[2].checked || boxes[3].checked)
        avatar.attr('src', ins);
    else
        avatar.attr('src', def);
}

function generalDiceClick()
{
    diceRoll.show();
    rollDice();
}