const formItem = document.getElementById('formItem');
const input = document.getElementById('task');
const indexError = document.getElementById('index-error');
const list = document.getElementById('list');
const clearAll = document.getElementById('claerAll');
const filter = document.getElementById('filter');
const btn = document.getElementById('btn');
const btnCancel=document.getElementById('btnCancel');
let isUpdate = false;
let draggedItem = null;
function displayItem() {
    let localArray = locallArrayStorage();
    localArray.forEach(item => addDomLi(item));
    checkUi();
}
function addList(e) {
    e.preventDefault();
    if (input.value === '') {
        indexError.innerText = "please fill the input";
        return;
    } else {
        indexError.innerText = "";
    }
    if (checkTekrari(input.value)) {
        indexError.innerText = "item is tekrari";
        return;
    } else {
        indexError.innerText = "";
    }
    if (isUpdate) {
        const liRemove = list.querySelector('.editMode');
        removeStorageItem(liRemove.textContent);
        liRemove.remove();
        btn.innerHTML="Add item";
        btn.classList.replace('btn-primary', 'btn-add');
        isUpdate=false;
        btnCancel.style.display="none";
    }
    addDomLi(input.value);
    addLocalStorage(input.value);
    input.value = "";
    checkUi();
}
function checkTekrari(item) {
    const itemStorage = locallArrayStorage();
    return itemStorage.includes(item);
}
function addDomLi(item) {
    const li = document.createElement('li');
    const mybtn = btnRemove('bi bi-x text-danger btnRemove2');
    li.classList.add('liclass');
    li.innerText = item;
    li.appendChild(mybtn);
    li.setAttribute('draggable', true);
    list.appendChild(li);
}
function addLocalStorage(item) {
    let localArray = locallArrayStorage();
    localArray.push(item);
    localStorage.setItem('items', JSON.stringify(localArray));
}
function locallArrayStorage() {
    let localArray;
    if (localStorage.getItem('items') === null) {
        localArray = [];
    } else {
        localArray = JSON.parse(localStorage.getItem('items'));
    }
    return localArray;
}
function btnRemove(myclass) {
    const btnremove = document.createElement('i');
    btnremove.classList.add(...myclass.split(' '));
    return btnremove;
}
function removeItem(e) {
    if (e.target.classList.contains('bi')) {
        e.target.parentElement.remove();
        removeStorageItem(e.target.parentElement.textContent);
    } else {
        const myli=e.target.closest('li');
        if(myli){
            setUpdateItem(myli);
        }
    }
    checkUi();
}
function setUpdateItem(item) {
    isUpdate = true;
    list.querySelectorAll('li').forEach(item => item.classList.remove('editMode'));
    item.classList.add('editMode');
    input.value = item.textContent;
    btn.innerHTML = "update item";
    btn.classList.replace('btn-add', 'btn-primary');
    btnCancel.style.display="inline-block";
}
function removeStorageItem(item) {
    let localArray = locallArrayStorage();
    localArray = localArray.filter((i) => i !== item);
    localStorage.setItem('items', JSON.stringify(localArray));
}
function removAlllist() {
    list.innerHTML = '';
    localStorage.removeItem('items');
    checkUi();
}
function checkUi() {
    const myli = list.querySelectorAll('li');
    if (myli.length === 0) {
        clearAll.style.display = "none";
        filter.style.display = "none";
    } else {
        clearAll.style.display = "block";
        filter.style.display = "block";
    }
    indexError.innerText = "";
}
function fillterItem(e) {
    const myliList = list.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    myliList.forEach((item) => {
        if (item.textContent.toLowerCase().includes(text)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    })
}
function cancelUpdate(){
    isUpdate=false;
    const cancelli=list.querySelector('.editMode');
    cancelli.classList.remove('editMode');
    input.value="";
    btn.innerHTML="Add item";
    // console.log(btn.classList);
    btn.classList.replace('btn-primary','btn-add');
    btnCancel.style.display="none";
}
function updateStorageOrder() {
    const items = [];
    list.querySelectorAll('li').forEach(li => {
        items.push(li.textContent);
    });
    localStorage.setItem('items', JSON.stringify(items));
}

list.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('li');
    draggedItem.classList.add('dragging');
});

list.addEventListener('dragend', () => {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
        updateStorageOrder();
    }
});

list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const targetLi = e.target.closest('li');
    if (!targetLi || targetLi === draggedItem) return;
    const rect = targetLi.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    if (offset > rect.height / 2) {
        targetLi.after(draggedItem);
    } else {
        targetLi.before(draggedItem);
    }
});
formItem.addEventListener('submit', addList);
list.addEventListener('click', removeItem);
clearAll.addEventListener('click', removAlllist);
filter.addEventListener('input', fillterItem);
btnCancel.addEventListener('click',cancelUpdate);
document.addEventListener('DOMContentLoaded', displayItem);
checkUi();