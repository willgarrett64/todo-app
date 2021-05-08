// Import all drag and drop functionality
import { dragStart, dragOver, drop } from './dragAndDrop.js'

// Define DOM elements that will be use throughout the script. 
const toDoListEl = document.getElementById('to-do-list'); //<div> that contains all the to-dos
const tasksLeftEl = document.getElementById('tasks-left'); //where the number of remaining to-dos is displayed
const inputEl = document.getElementById("to-do-input"); //where the user writes a new to-do
const btnEl = document.getElementById('to-do-button'); //button to submit new to-dos
const clearCompletedEl = document.getElementById('clear-completed'); //button for deleting all completed to-dos

// Define a list of pre-defined to-dos (this will eventually be incorporated into the backend code.)
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

// Start ID count on one above the amount of items in pre-existing list of to-do items
let id = toDoList.length + 1;
let containerId = 1;


// Create a to-do container element (each to-do item sits in a container div).
const createContainerEl = (id) => {
  // create a container <div> element and assign it a class and ID (ID will be generated when rendering) 
  const container = document.createElement('div');
  container.className = "to-do-container";
  container.id = `container ${id}`
  
  //enable ability to drop to-do items into a container
  container.addEventListener('dragover', dragOver);
  container.addEventListener('drop', drop);

  return(container)
}

// Create a new to-do element for the DOM by passing in a to-do object from toDoList. 
const createToDoEl = (toDoObject) => {
  // create the to-do element's outer <div> and assign it a class and ID
  const toDo = document.createElement('div');
  toDo.className = "to-do-item";
  toDo.id = toDoObject.id;

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

// Add a to-do item to the DOM. The to-do parameter passed in is the object from toDoList. 
const addToDoToDom = (toDoObject, containerId) => {
  //first create a container and the to-do element
  const newContainer = createContainerEl(containerId);
  const newToDo = createToDoEl(toDoObject);
  //add the to-do as a child of the container
  newContainer.appendChild(newToDo);
  //add new to-do to the DOM
  toDoListEl.appendChild(newContainer)
}



// Add a new to-do to the toDoList array
const addToDo = input => {
  //create a new toDo object
  const newToDo = { text: input, active: true, id: id };
  //increment id so that it's never repeated
  id++;
  //push new object to toDoList array  
  toDoList.push(newToDo);
}

// Delete a single to-do from the toDoList array
const deleteToDo = id => {
  //filter out the element with matching ID from toDoList 
  toDoList = toDoList.filter(el => el.id != id);
}


// Event handler for adding new to-dos (clicking "Add" or hitting "Enter" key)
const handleAddNewToDo = e => {
  // keyCode 13 is then enter key. 
  if (e.keyCode === 13 || e.type === 'click') {
    //prevent default behaviour of submitting a form and refreshing on hitting the button
    e.preventDefault();
    //if the input field is blank, do nothing
    if (!inputEl.value) {
      return;
    }
    //add a new to-do based on user input
    addToDo(inputEl.value)
    //re-render the list in the DOM
    render()
    //reset inputEl to blank
    inputEl.value = null;
  }
}
// Assign event handler to both the button and input elements
btnEl.addEventListener('click', handleAddNewToDo)
inputEl.addEventListener('keydown', handleAddNewToDo)


// Event handler for deleting a single to-do (by clicking on the cross "x"). This event handler is assigned in createToDoEl function
const handleDeleteToDo = e => {
  //access the to-do that was clicked on and its ID
  const toDo = e.target.parentElement;
  const id = toDo.id;
  //delete the to-do from toDoList based on ID
  deleteToDo(id)
  //re-render the updated toDoList
  render()
}

// Event handler for deleting all completed to-dos
const handleDeleteAllCompleted = () => {
  //update toDoList by filtering out all completed (active = false) tasks
  toDoList = toDoList.filter(el => el.active);
  //re-render the updated toDoList
  render()
}
// Assign event handler to the "clear all completed" element
clearCompletedEl.addEventListener('click', handleDeleteAllCompleted)

// Event handler for checkboxes to set to-do as active or complete. This event handler is assigned in createToDoEl function
const handleCheckChange = e => {
  //access the to-do clicked on, its ID and checkbox value (true or false)
  const value = e.target.checked;
  const id = e.target.parentElement.id;
  //find corresponding to-do in toDoList and set value of its active property
  const index = toDoList.findIndex(el => el.id == id);
  toDoList[index].active = !value;
  //re-render the updated toDoList
  render()
}




// Declare and update "view" which determines whether to review all, just completed or just active to-dos in render()
let view = 'all';
const setView = e => {
  //remove class of 'active' from currently selected view
  const active = document.getElementsByClassName('active');
  active[0].classList.remove('active')
  //add class of 'active' to newly selected view
  e.target.className += ' active';
  //update view
  view = e.target.id;
  //re-render list of to-dos 
  render();
}
// Assign setView event listener to the all, active and completed elements (all have a class of 'view'). 
const viewSelectors = document.querySelectorAll('.view')
viewSelectors.forEach(el => {
  el.onclick = setView;
})


/* Render all to-dos from the toDoList array (dependent on 'view').
Notes: This is an early draft of a function to render elements to the DOM when toDoList is updated. As it stands, it's fairly inefficient as it deletes all to-dos from the DOM and re-renders them all, however I plan to expand on this to compare the current DOM with the new DOM to only render what has changed, similar to how React works.
*/
const render = () => {
  //remove all elements currently in the to-do list <div>
  while (toDoListEl.lastChild) {
    toDoListEl.lastChild.remove();
  }
  //create a new array of elements to display (based on view all, active or completed)
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
  //reset container ID to 1. This will increment for each to-do added
  containerId = 1; 
  //render each item of toDisplay to the to-do list <div>
  toDisplay.forEach(toDo => {
    addToDoToDom(toDo, containerId)
    containerId++;
  })
  
  //update the tasks-left element, counting all "active" to-dos - I plan to improve this section later
  let tasksLeft = 0;
  toDoList.forEach(el => {
    if (el.active) {
      tasksLeft += 1;
    }
  })
  tasksLeftEl.innerHTML = `${tasksLeft} items left`;
}

// Call render once on first page load. It will then be re-called on each change
render()