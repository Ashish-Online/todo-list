const todoForm = document.querySelector('.todo-form');
const inputItem = document.querySelector('.input-item');
const itemList = document.querySelector('.item-list');
const submitBtn = document.querySelector('.submit-btn');
const filterItem = document.querySelector('.input-filter');
const clearAllBtn = document.querySelector('.clear-btn');

let onEditMode = false;

function displayItem() {
  itemList.innerHTML = ``;
  let itemFromLocalStorage = getItemFromLocalStorage();

  itemFromLocalStorage.forEach((item) => {
    addItemDOM(item);
  });
}

function onAddItembutton(e) {
  e.preventDefault();
  const item = inputItem.value;
  inputItem.value = '';
  // console.log(item);

  if (item != '') {
    if(checkIfItemExists(item)===true){
      alert('Item already exists!');
      return;
    }

    addItemDOM(item);
      addItemLocal(item);
  }
  chechUI();
}

function addItemDOM(item) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  li.className = 'item';
  button.className = 'remove-btn';
  button.innerText = 'x';
  li.innerText = `${item}`;
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemLocal(item) {
  let itemFromLocalStorage = getItemFromLocalStorage();

  itemFromLocalStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemFromLocalStorage));
}

function getItemFromLocalStorage() {
  let itemFromLocalStorage;

  if (localStorage.getItem('items') === null) {
    itemFromLocalStorage = [];
  }
  else {
    itemFromLocalStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemFromLocalStorage;
}

function onItemClick(e) {

  if (e.target.classList.contains('remove-btn')) {
    let item = e.target;
    if (confirm('Are you sure?')) {
      removeItem(item);
    }
  }
  else {
    let item = e.target;
    editItem(item);
  }
}

function removeItem(item) {
  //Remove item form DOM
  item.parentElement.remove();

  item = item.parentElement.innerText;
  const length = item.length;
  item = item.slice(0, length - 1);

  //removeItem from LocalStorage
  removeItemFromLocal(item);
  
  chechUI();
}

function removeItemFromLocal(item) {
  let itemFromLocalStorage = getItemFromLocalStorage();
  
  itemFromLocalStorage = itemFromLocalStorage.filter((i) => i !== item);
  
  localStorage.setItem('items', JSON.stringify(itemFromLocalStorage));
}

function clearAll() {
  const items = itemList.querySelectorAll('.item');
  items.forEach((item) => {
    item.remove();
  });
  chechUI();
}

function editItem(item) {
  onEditMode = true;
  item.classList.add('on-edit-mode');
  item = item.innerText;
  const length = item.length;
  item = item.slice(0, length - 2);

  inputItem.value = item;
  
  submitBtn.innerText = `Edit item`;
  submitBtn.classList.add('edit-btn');

  console.log(item);
  
  removeItemFromLocal(item);
}

function checkIfItemExists(item){
  let itemFromLocalStorage = getItemFromLocalStorage();

  if(itemFromLocalStorage.includes(item)){
    console.log('true finds');
    
    return true;
  }
  else{
    return false;
  }
}

function onFilterItem(e){
  const value = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('.item');
  console.log('value', value);
  
  items.forEach((item)=>{
    if(item.innerText.toLowerCase().includes(`${value}`)){
      item.style.display='flex';
    }
    else{
      item.style.display='none';
    }
  });
}

function chechUI() {
  const items = itemList.querySelectorAll('.item');
  onEditMode = false;

  if (items.length !== 0) {
    filterItem.style.display = 'block';
    clearAllBtn.style.display = 'block';
  }
  else {
    filterItem.style.display = 'none';
    clearAllBtn.style.display = 'none';
  }

  if(onEditMode === false){
    submitBtn.innerText = '+ Submit item';
    submitBtn.classList.remove('edit-btn');
  }
  displayItem();
}

document.addEventListener('DOMContentLoaded', displayItem());
itemList.addEventListener('click', onItemClick);
submitBtn.addEventListener('click', onAddItembutton);
clearAllBtn.addEventListener('click', clearAll);
filterItem.addEventListener('input', onFilterItem);
chechUI();