const skillContainers = document.getElementsByClassName('acds-skill-container');
const skillLabels = document.getElementsByClassName('acds-skill-label');

const addSkillModal = new bootstrap.Modal(document.getElementById('addSkill'));
const createSkillModal = new bootstrap.Modal(document.getElementById('createSkill'));

const personalizedSkillList = document.getElementById('skillSpecializationList');
const personalizedSkillName = document.getElementById('skillName');

function containerMouseOver(cont, label, txt)
{
    cont.style.backgroundColor = 'white';
    label.style.color = 'black';
    txt.style.backgroundColor = 'white';
    txt.style.color = 'black';
}

function containerMouseOut(cont, label, txt)
{
    cont.style.backgroundColor = 'black';
    label.style.color = 'white';
    txt.style.backgroundColor = 'black';
    txt.style.color = 'white';
}

function skillSearchBarInput(searchBar)
{
    let str = searchBar.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    for (let i = 0; i < skillContainers.length; i++)
    {
        const cont = skillContainers[i];
        let txt = skillLabels[i].textContent.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");;

        cont.hidden = !txt.includes(str);
    }
}

function skillInput(id, skill, check)
{
    let txt = skill.value;

    $.ajax('/sheet/player/skill',
    {
        method: 'POST',
        data: {playerID: playerID, skillID: id, value: txt, checked: check.checked},
        error: err =>
        {
            console.log(err);
            failureToast.show();
        }
    });
}

function skillCheckChange(id, skill, check)
{
    let txt = skill.value;
    
    $.ajax('/sheet/player/skill',
    {
        method: 'POST',
        data: {playerID: playerID, skillID: id, value: txt, checked: check.checked},
        error: err =>
        {
            console.log(err);
            failureToast.show();
        }
    });
}

function createSkill(event)
{
    event.preventDefault();
    let specializationID = personalizedSkillList.value;
    let skillName = personalizedSkillName.value;

    if (specializationID === '0')
        specializationID = null;

    $.ajax('/sheet/skill',
    {
        method: 'PUT',
        data: {skillName: skillName, specializationID: specializationID},
        success: (data) =>
        {
            location.reload();
        },
        error: (err) =>
        {
            console.log(err);
            failureToast.show();
        }
    });
    createSkillModal.hide();
}

function addSkill(ev, list)
{
    ev.preventDefault();
    let id = list.value;
    $.ajax('/sheet/player/skill',
    {
        method: 'PUT',
        data: {playerID: playerID, skillID: id},
        success: (data) =>
        {
            location.reload();
        },
        error: (err) =>
        {
            console.log(err);
            failureToast.show();
        }
    });
    addSkillModal.hide();
}

function skillDiceClick(skill)
{
    diceRoll.show();
    rollDice(parseInt(skill.value));
}