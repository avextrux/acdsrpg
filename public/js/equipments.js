const addEquipmentModal = new bootstrap.Modal(document.getElementById('addEquipment'));
const createEquipmentModal = new bootstrap.Modal(document.getElementById('createEquipment'));

const diceRoll = new bootstrap.Modal(document.getElementById('diceRoll'));

const equipmentName = document.getElementById('createEquipmentName');
const equipmentDamage = document.getElementById('createEquipmentDamage');
const equipmentRange = document.getElementById('createEquipmentRange');
const equipmentAttacks = document.getElementById('createEquipmentAttacks');
const equipmentAmmo = document.getElementById('createEquipmentAmmo');
const equipmentMalf = document.getElementById('createEquipmentMalf');
const equipmentSpecialization = document.getElementById('combatSpecializationList');

function addEquipment(event, list)
{
    event.preventDefault();
    let id = list.value;
    $.ajax('/sheet/player/equipment',
    {
        method: 'PUT',
        data: {playerID: playerID, equipmentID: id},
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
    
    addEquipmentModal.hide();
}

function deleteEquipment(id)
{
    if (!confirm("Você realmente quer remover esse equipamento?"))
        return;

    $.ajax('/sheet/player/equipment',
    {
        method: 'DELETE',
        data: {playerID: playerID, equipmentID: id},
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
}

function createEquipment(event)
{
    event.preventDefault();
    $.ajax('/sheet/equipment',
    {
        method: 'PUT',
        data: {name: equipmentName.value, skillID: equipmentSpecialization.value, 
            damage: equipmentDamage.value, range: equipmentRange.value, 
            attacks: equipmentAttacks.value, ammo: equipmentAmmo.value, 
            malf: equipmentMalf.value},
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
    createEquipmentModal.hide();
}

function equipmentUsingChange(id, check, txt)
{
    $.ajax('/sheet/player/equipment',
    {
        method: 'POST',
        data: {playerID: playerID, equipmentID: id, using: check.checked, currentAmmo: txt.value},
        error: (err) =>
        {
            check.checked = !check.checked;
            console.log(err);
            failureToast.show();
        }
    });
}

function equipmentAmmoInput(id, check, txt)
{
    let maxAmmo = parseInt($(`#equipmentMaxAmmo-${id}`).text());

    if (isNaN(maxAmmo))
    {
        txt.value = '-';
        alert('Esse equipamento não possui munição.');
        return;
    }
    else
    {
        let curAmmo = parseInt(txt.value);
        if (curAmmo > maxAmmo)
        {
            txt.value = maxAmmo;
            alert('Você não pode ter mais balas do que a capacidade do equipamento.');
            return;
        }
    }

    $.ajax('/sheet/player/equipment',
    {
        method: 'POST',
        data: {playerID: playerID, equipmentID: id, using: check.checked, currentAmmo: txt.value},
        error: (err) =>
        {
            console.log(err);
            failureToast.show();
        }
    });
}

function equipmentDiceClick(id, damageField, ammoTxt)
{
    let ammo = parseInt(ammoTxt.value);
    let ammoPass = true;
    let maxAmmo = parseInt($(`#equipmentMaxAmmo-${id}`).text());

    if (!isNaN(maxAmmo))
    {
        if (isNaN(ammo) || ammo <= 0)
            ammoPass = false;
        else
            ammoTxt.value = (--ammo).toString();
    }

    if (ammoPass)
    {
        diceRoll.show();
        let dmg = resolveDices(damageField.textContent);
        rollDices(dmg);
    }
    else
    {
        diceRoll.hide();
        alert('Você não tem munição para isso.');
    }

    var ev = document.createEvent('Event');
    ev.initEvent('input', true, true);
    ammoTxt.dispatchEvent(ev);
}