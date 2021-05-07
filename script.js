// import {toDoList} from './toDoList.js'
let toDoList = [
  {
    text: "Finish CSS on this app",
    active: true,
    id: 1,
  },
  {
    text: "Tidy up the code a little bit",
    active: true,
    id: 2,
  },
  {
    text: "Use this app as a base for my first bit of backend development",
    active: true,
    id: 3,
  },
];

import { dragStart, dragOver, drop } from './dragAndDrop.js'

const toDoListElement = document.getElementById('to-do-list');
const tasksLeftEl = document.getElementById('tasks-left');

  

// Start ID count on one above the amount of items in pre-existing list of to-do items
let id = toDoList.length + 1;
let containerId = 1;


// create a to-do container element (each to-do item sits in a container div)
const createContainerEl = (id) => {
  const container = document.createElement('div');
  container.className = "to-do-container";
  container.id = `container ${id}`
  
  //enable ability to drop to-do items into a container
  container.addEventListener('dragover', dragOver);
  container.addEventListener('drop', drop);

  return(container)
}
// create a new to-do element for the DOM
const createToDoEl = (toDoObject) => {
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
const addToDoToDom = (toDo, containerId) => {
  //first create a container, then add the to-do element as a child element
  const newContainer = createContainerEl(containerId);
  newContainer.appendChild(toDo);
  
  //add new to-do to the DOM
  toDoListElement.appendChild(newContainer)
}



// add a new to-do to the toDoList array
const addToDo = text => {
  //create a new toDo object
  const newToDo = { text: text, active: true, id: id };
  //increment id so that it's never repeated
  id++;
  //push new object to toDoList array  
  toDoList.push(newToDo);
}
// delete a single to-do from the toDoList array
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

  addToDo(inputVal)
  
  render()

  inputEl.value = null;}
}
const btn = document.getElementById('to-do-button');
btn.addEventListener('click', handleAddNewToDo)
const input = document.getElementById('to-do-input');
input.addEventListener('keydown', handleAddNewToDo)

// event handler for deleting a single to-do (by clicking on the cross "x")
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
const all = document.getElementById('all');
const active = document.getElementById('active');
const completed = document.getElementById('completed');
all.onclick = setView;
active.onclick = setView;
completed.onclick = setView;


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

  //re-set container ID to 1. This will increment for each to-ado added
  containerId = 1; 
  // render toDisplay into the to-do list <div>
  toDisplay.forEach(toDo => {
    addToDoToDom(createToDoEl(toDo), containerId)
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
