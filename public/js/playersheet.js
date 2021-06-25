// //This script was intended to be a lighter version for the player sheet, but I didn't get the time to finish it.

// //----------------
// //-   General    -
// //----------------

// function clamp(n, min, max)
// {
//     if (n < min)
//         return min;
//     if (n > max)
//         return max;
//     return n;
// }

// const diceRollMax = 100;
// const diceResultContent = document.getElementById('diceResultContent');
// const diceResultDescription = document.getElementById('diceResultSuccess');
// const goodRate = 0.5, extremeRate = 0.2;

// const diceRoll = new bootstrap.Modal(document.getElementById('diceRoll'));
// const diceRollModal = document.getElementById('diceRoll');
// const failureToast = new bootstrap.Toast(document.getElementById('failureToast'), {delay: 5000});

// function rollDice(num = -1, showBranches = true)
// {
//     function onSuccess(data)
//     {
//         let roll = data.num;
//         let successType = resolveSuccessType(num, roll, showBranches);

//         document.getElementById("loader").style.display = "none";
//         diceResultContent.textContent = roll;
//         diceResultContent.style.display = "block";
//         if (num !== -1)
//         {
//             diceResultDescription.textContent = successType;
//             setTimeout(() => diceResultDescription.style.display = "block", 750);
//         }
//     }

//     $.ajax('/dice/single', 
//     {
//         data: {max: diceRollMax},
//         success: onSuccess
//     });
// }

// function rollDices(dices)
// {
//     function onSuccess(data)
//     {
//         let sum = data.sum;
//         let results = data.results;

//         document.getElementById("loader").style.display = "none";
//         diceResultContent.textContent = sum.toString();
//         diceResultContent.style.display = "block";
//         diceResultDescription.textContent = results.join(' + ');
//         setTimeout(() => diceResultDescription.style.display = "block", 750);
//     }
    
//     $.ajax('/dice/multiple', 
//     {
//         data: {dices},
//         success: onSuccess
//     });
// }


// diceRollModal.addEventListener('hidden.bs.modal', ev =>
// {
//     document.getElementById("loader").style.display = "block";
//     diceResultContent.textContent = '';
//     diceResultContent.style.display = "none";
//     diceResultDescription.style.display = "none";
// })

// function resolveSuccessType(num, roll, showBranches)
// {
//     if (showBranches)
//     {
//         if (roll === 100)
//             return 'Desastre';
//         if (roll === 1)
//             return 'Perfeito';
//         if (roll <= num * extremeRate)
//             return 'Extremo';
//         if (roll <= num * goodRate)
//             return 'Bom';
//     }
//     if (roll <= num)
//         return 'Sucesso';
//     if (roll > num)
//         return 'Fracasso';
// }

// function resolveDices(str)
// {
//     let dices = str.split('+');
//     let arr = [];
//     for (let i = 0; i < dices.length; i++)
//     {
//         const dice = dices[i];
//         resolveDice(dice, arr);
//     }
//     return arr;
// }

// function resolveDice(dice, arr)
// {
//     if(dice.includes('db'))
//         return resolveDice(specs.get('Dano Bônus'), arr);
    
//     let n = 0, num;
//     if (dice.includes('d'))
//     {
//         let split = dice.split('d');
//         n = split[0];
//         num = split[1];
//         for (let i = 0; i < n; i++)
//         {
//             arr.push({n:'1', num});
//         }
//     }
//     else
//     {
//         arr.push({n, num: dice});
//     }
// }

// //----------------
// //-  Basic Info  -
// //----------------

// function basicInfoChanged(ev, id)
// {
//     let element = ev.target;
//     let text = element.value;

//     $.ajax('/sheet/player/info',
//     {
//         method: 'POST',
//         data: {playerID: playerID, infoID: id, value: text},
//         error: err =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// //----------------
// //-  Attributes  -
// //----------------

// function attributeBarClick(ev, id)
// {
//     let bar = ev.target;
//     let desc = $(`#attributeDesc-${id}`);

//     let split = desc.text().split('/');
//     let cur = parseInt(split[0]);
//     let max = parseInt(split[1]);

//     let newMax = prompt('Digite o novo máximo do atributo:', max);

//     if (isNaN(newMax))
//         return;

//     let newCur = clamp(cur, 0, newMax);

//     $.ajax('/sheet/player/attribute',
//     {
//         method: 'POST',
//         data: {playerID: playerID, attributeID: id, value: newCur, maxValue: newMax},
//         success : data =>
//         {
//             desc.text(`${newCur}/${newMax}`);
//             resolveAttributeBar(newCur, newMax, bar);
//         },
//         error: err =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function attributeIncreaseClick(ev, id)
// {
//     let bar = $(`#attributeBar-${id}`);
//     let desc = $(`#attributeDesc-${id}`);

//     let diff = 1;
//     if (ev.shiftKey)
//         diff = 10;

//     let split = desc.text().split('/');

//     let cur = parseInt(split[0]);
//     let max = parseInt(split[1]);
//     let newCur = clamp(cur + diff, 0, max);

//     desc.text(`${newCur}/${max}`);
//     resolveAttributeBar(newCur, max, bar);

//     $.ajax('/sheet/player/attribute',
//     {
//         method: 'POST',
//         data: {playerID: playerID, attributeID: id, value: newCur, maxValue: max},
//         error: err =>
//         {
//             desc.text(`${cur}/${max}`);
//             resolveAttributeBar(cur, max, bar);
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function attributeDecreaseClick(ev, id)
// {
//     let bar = $(`#attributeBar-${id}`);
//     let desc = $(`#attributeDesc-${id}`);

//     let diff = 1;
//     if (ev.shiftKey)
//         diff = 10;

//     let split = desc.text().split('/');

//     let cur = parseInt(split[0]);
//     let max = parseInt(split[1]);
//     let newCur = clamp(cur - diff, 0, max);

//     desc.text(`${newCur}/${max}`);
//     resolveAttributeBar(newCur, max, bar);

//     $.ajax('/sheet/player/attribute',
//     {
//         method: 'POST',
//         data: {playerID: playerID, attributeID: id, value: newCur, maxValue: max},
//         error: err =>
//         {
//             desc.text(`${cur}/${max}`);
//             resolveAttributeBar(cur, max, bar);
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function attributeDiceClick(id)
// {
//     let desc = $(`#attributeDesc-${id}`);

//     diceRoll.show();

//     let split = desc.text().split('/');

//     let cur = parseInt(split[0]);

//     rollDice(cur, false);
// }

// function resolveAttributeBar(now, max, bar)
// {
//     let coeficient = (now / max) * 100.0;
//     bar.css('width', coeficient);
// }

// //---------------------
// //-  Characteristics  -
// //---------------------

// function characteristicChanged(ev, id)
// {
//     let element = ev.target;

//     if (isNaN(element.value))
//         return;

//     let text = element.value;

//     $.ajax('/sheet/player/characteristic',
//     {
//         method: 'POST',
//         data: {playerID: playerID, characteristicID: id, value: text},
//         error: err =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function characteristicDiceClick(id)
// {
//     let input = $(`characteristic-${id}`);
//     diceRoll.show();
//     rollDice(input.value);
// }

// // /--------------\
// // |  Equipments  |
// // \--------------/

// const equipmentName = $('#createEquipmentName');
// const equipmentDamage = $('#createEquipmentDamage');
// const equipmentRange = $('#createEquipmentRange');
// const equipmentAttacks = $('#createEquipmentAttacks');
// const equipmentAmmo = $('#createEquipmentAmmo');
// const equipmentMalf = $('#createEquipmentMalf');
// const equipmentSpecialization = $('#combatSpecializationList');
// const addEquipmentList = $('#addEquipmentList');

// function addEquipmentSubmit(ev)
// {
//     ev.preventDefault();
//     let id = addEquipmentList.val();

//     $.ajax('/sheet/player/equipment',
//     {
//         method: 'PUT',
//         data: {playerID: playerID, equipmentID: id},
//         success: (data) =>
//         {
//             location.reload();
//         },
//         error: (err) =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
    
//     addEquipmentModal.hide();
// }

// function deleteEquipmentButton(id)
// {
//     if (!confirm("Você realmente quer remover esse equipamento?"))
//         return;

//     $.ajax('/sheet/player/equipment',
//     {
//         method: 'DELETE',
//         data: {playerID: playerID, equipmentID: id},
//         success: (data) =>
//         {
//             location.reload();
//         },
//         error: (err) =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function createEquipmentSubmit(ev)
// {
//     ev.preventDefault();
//     $.ajax('/sheet/equipment',
//     {
//         method: 'PUT',
//         data: {name: equipmentName.value, skillID: equipmentSpecialization.value, 
//             damage: equipmentDamage.value, range: equipmentRange.value, 
//             attacks: equipmentAttacks.value, ammo: equipmentAmmo.value, 
//             malf: equipmentMalf.value},
//         success: (data) =>
//         {
//             location.reload();
//         },
//         error: (err) =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
//     createEquipmentModal.hide();
// }

// function equipmentUsingChanged(ev, id)
// {
//     let check = ev.target;
//     let txt = $(`equipmentAmmo-${id}`);

//     $.ajax('/sheet/player/equipment',
//     {
//         method: 'POST',
//         data: {playerID: playerID, equipmentID: id, using: check.checked, currentAmmo: txt.value},
//         error: (err) =>
//         {
//             check.checked = !check.checked;
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function equipmentAmmoChanged(ev, id)
// {
//     let txt = ev.target;
//     let check = $(`#equipmentUsing-${id}`);
//     $.ajax('/sheet/player/equipment',
//     {
//         method: 'POST',
//         data: {playerID: playerID, equipmentID: id, using: check.checked, currentAmmo: txt.value},
//         error: (err) =>
//         {
//             console.log(err);
//             failureToast.show();
//         }
//     });
// }

// function equipmentDiceClick(damageField, ammoTxt)
// {
//     let ammo = parseInt(ammoTxt.value);
//     let ammoPass = true;

//     if (!isNaN(ammo))
//     {
//         if (ammo <= 0)
//             ammoPass = false;
//         else
//             ammoTxt.value = (--ammo).toString();
//     }

//     if (ammoPass)
//     {
//         diceRoll.show();
//         let dmg = resolveDices(damageField.textContent.toLowerCase().replace(/\s+/g, ''));
//         rollDices(dmg);
//     }
//     else
//     {
//         diceRoll.hide();
//         alert('Você não tem munição para isso.');
//     }

//     var ev = document.createEvent('Event');
//     ev.initEvent('input', true, true);
//     ammoTxt.dispatchEvent(ev);
// }