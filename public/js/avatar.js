const boxes = [];
const attributeStatus = document.getElementsByClassName('acds-attribute-status');

const defAvatar = document.getElementById('defAvatarFile');
const uncAvatar = document.getElementById('unconsciousAvatarFile');
const mwAvatar = document.getElementById('mwAvatarFile');
const insAvatar = document.getElementById('insaneAvatarFile');
const mwinsAvatar = document.getElementById('mwinsaneAvatarFile');

const uploadAvatarModal = new bootstrap.Modal(document.getElementById('uploadAvatar'));

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
        success: data => location.reload(),
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
    {
        avatar.src = `/avatars/unconscious?id=${playerID}`;
    }
    else if (boxes[1].checked)
    {
        if (boxes[2].checked || boxes[3].checked)
        {
            avatar.src = `/avatars/mwinsane?id=${playerID}`;
        }
        else
        {
            avatar.src = `/avatars/mw?id=${playerID}`;
        }
    }
    else if (boxes[2].checked || boxes[3].checked)
    {
        avatar.src = `/avatars/insane?id=${playerID}`;
    }
    else
    {
        avatar.src = `/avatars/def?id=${playerID}`;
    }
}

function generalDiceClick()
{
    diceRoll.show();
    rollDice();
}