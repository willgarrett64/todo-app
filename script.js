// import {toDoList} from './toDoList.js'
let toDoList = [
  {
    text: "Build my to-do app.",
    active: true,
    id: 1,
  },
  {
    text: "Fix the design. It looks crap!",
    active: true,
    id: 2,
  },
];

import { dragStart, dragOver, drop } from './dragAndDrop.js'

const toDoListElement = document.getElementById('to-do-list');
const tasksLeftEl = document.getElementById('tasks-left');

  

// Start ID count on one above the amount of items in pre-existing list of to-do items
let id = toDoList.length + 1;



// create a to-do container (each to-do item sits in a container div)
const createContainer = (id) => {
  const container = document.createElement('div');
  container.className = "to-do-container";
  container.id = `container ${id}`
  
  //enable ability to drop to-do items into a container
  container.addEventListener('dragover', dragOver);
  container.addEventListener('drop', drop);

  return(container)
}
// create a new to-do item
const createToDo = (toDoObject) => {
  const toDo = document.createElement('div');

  toDo.className = "to-do-item";
  toDo.id = toDoObject.id;
  toDo.active = toDoObject.active;

  //create checkbox to mark to-do as complete
  const checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.checked = !toDoObject.active;
  checkbox.addEventListener('change', handleCheckChange)
  
  //create text element inside the to-do item
  const toDoText = document.createElement('p');
  toDoText.innerText = toDoObject.text;
  if (checkbox.checked) {
    toDoText.className = 'checked'
  }
  
  //create button to delete the to-d0
  const deleteBtn = document.createElement('img');
  deleteBtn.src = './Todo-app-main/images/icon-cross.svg';
  deleteBtn.addEventListener('click', handleDeleteToDo)

  //add checkbox, text and button as child elements of the to-do
  toDo.append(checkbox, toDoText, deleteBtn)

  //enable avbility to drag and drop the to-do item
  toDo.draggable = true
  toDo.addEventListener('dragstart', dragStart);

  return(toDo)
}




// add a to-do item to the DOM
const addToDo = (toDo, containerId) => {
  //first create a container, then add the to-do element as a child element
  const newContainer = createContainer(containerId);
  newContainer.appendChild(toDo);
  
  //add new to-do to the DOM
  toDoListElement.appendChild(newContainer)
}
// delete a to-do from the list
const deleteToDo = id => {
  // find corresponding to-do in toDoList and remove it
  const index = toDoList.findIndex(el => el.id == id);
  toDoList.splice(index, 1);
}




// event handler for adding new to-dos (clicking "Add" or hitting "Enter" key)
const handleAddNewToDo = e => {
  if (e.keyCode === 13 || e.type === 'click'){
  e.preventDefault();
  const inputEl = document.getElementById("to-do-input");
  const inputVal = inputEl.value;
  if (!inputVal) {
    return;
  }

  const newToDo = { text: inputVal, active: true, id: id };
  id++;

  toDoList.push(newToDo);
  
  render()

  inputEl.value = null;}
}
const btn = document.getElementById('to-do-button');
btn.addEventListener('click', handleAddNewToDo)
const input = document.getElementById('to-do-input');
input.addEventListener('keydown', handleAddNewToDo)

// event handler for deleting specific to-do
const handleDeleteToDo = e => {
  const toDo = e.target.parentElement;
  const id = toDo.id;
  deleteToDo(id)
  // re-render the updated toDoList
  render()
}

// event handler for deleting all completed to-dos
const handleDeleteAllCompleted = () => {
  toDoList = toDoList.filter(el => el.active);
  // re-render the updated toDoList
  render()
}
const clearCompleted = document.getElementById('clear-completed');
clearCompleted.addEventListener('click', handleDeleteAllCompleted)


// event handler for checkboxes to set to-do as active or complete
const handleCheckChange = e => {
  const value = e.target.checked;
  const id = e.target.parentElement.id;
  // find corresponding to-do in toDoList and set value of its active property
  const index = toDoList.findIndex(el => el.id == id);
  toDoList[index].active = !value;
  
  render()
}




// update "view" which determines whether to review all, just completed or just active to-dos in render()
let view = 'all';
const setView = e => {
  // update class so that the selected view is in bold
  all.className = 'pointer'
  active.className = 'pointer'
  completed.className = 'pointer'
  e.target.className = 'pointer active'

  // update view
  view = e.target.id;
  render();
}

// assign setView event listener to the all, active and completed elements. 
const all = document.getElementById('all').onclick = setView;;
const active = document.getElementById('active').onclick = setView;
const completed = document.getElementById('completed').onclick = setView;



// render all to-dos from the toDoList array
const render = () => {
  // remove all elements currently in the to-do list <div>
  while (toDoListElement.lastChild) {
    toDoListElement.lastChild.remove();
  }

  // create an array of elements to display (based on view all, active or completed)
  let toDisplay = [];
  switch (view) {
    case 'all':
      toDisplay = toDoList;
      break;
    case 'active':
      toDisplay = toDoList.filter(el => el.active);
      break;
    case 'completed':
      toDisplay = toDoList.filter(el => !el.active);
      break;
  }

  // render toDisplay into the to-do list <div>
  let containerId = 1;
  toDisplay.forEach(toDo => {
    addToDo(createToDo(toDo), containerId)
    containerId++;
  })
  
  // update the tasks-left element, counting all "active" to-dos
  let tasksLeft = 0;
  toDoList.forEach(el => {
    if (el.active) {
      tasksLeft += 1;
    }
  })
  tasksLeftEl.innerHTML = `${tasksLeft} items left`;
}


render()
