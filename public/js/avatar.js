const boxes = [];
const attributeStatus = document.getElementsByClassName('acds-attribute-status');

const defAvatar = document.getElementById('defAvatarFile');
const uncAvatar = document.getElementById('unconsciousAvatarFile');
const mwAvatar = document.getElementById('mwAvatarFile');
const insAvatar = document.getElementById('insaneAvatarFile');
const mwinsAvatar = document.getElementById('mwinsaneAvatarFile');

const uploadAvatarModal = new bootstrap.Modal(document.getElementById('uploadAvatar'));

const avatar = $('#avatar');
let oldSrc;

for (let i = 0; i < attributeStatus.length; i++)
{
    const stat = attributeStatus[i];
    boxes.push(stat);
}
evaluateAvatar();

async function uploadAvatar(ev)
{
    ev.preventDefault();
    let formData = new FormData();
    formData.append('id', playerID);
    formData.append('file', defAvatar.files[0]);
    formData.append('file', uncAvatar.files[0]);
    formData.append('file', mwAvatar.files[0]);
    formData.append('file', insAvatar.files[0]);
    formData.append('file', mwinsAvatar.files[0]);

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
    let src;

    if (boxes[0].checked)
        src = `/avatars/unconscious?id=${playerID}`;
    else if (boxes[1].checked)
        if (boxes[2].checked || boxes[3].checked)
            src = `/avatars/mwinsane?id=${playerID}`;
        else
            src = `/avatars/mw?id=${playerID}`;
    else if (boxes[2].checked || boxes[3].checked)
        src = `/avatars/insane?id=${playerID}`;
    else
        src = `/avatars/def?id=${playerID}`;

    if (src === oldSrc)
        return;
    
    oldSrc = src;

    $.get(src, data =>
    {
        avatar.attr('src', data.url);
    });
}

function generalDiceClick()
{
    diceRoll.show();
    rollDice();
}