const addItemList = document.getElementById('addItemList');
const addItemModal = new bootstrap.Modal(document.getElementById('addItem'));
const createItemModal = new bootstrap.Modal(document.getElementById('createItem'));

const createItemName = document.getElementById('createItemName');
const createItemDescription = document.getElementById('createItemDescription');

function moneyInput(id, txt)
{
    let money = txt.value;
    $.ajax('/sheet/player/info',
    {
        method: 'POST',
        data: {playerID: playerID, infoID: id, value: money},
        error: (err) =>
        {
            console.log(err);
            failureToast.show();
        }
    });
}

function addItem(ev, list)
{
    ev.preventDefault();
    let id = list.value;
    
    $.ajax('/sheet/player/item',
    {
        method: 'PUT',
        data: {playerID: playerID, itemID: id},
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
    
    addItemModal.hide();
}

function createItem(ev)
{
    ev.preventDefault();

    $.ajax('/sheet/item',
    {
        method: 'PUT',
        data: {name: createItemName.value, 
            description: createItemDescription.value},
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
    createItemModal.hide();
}

function deleteItem(id)
{
    if (!confirm("Você realmente quer remover esse equipamento?"))
        return;

    $.ajax('/sheet/player/item',
    {
        method: 'DELETE',
        data: {playerID: playerID, itemID: id},
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