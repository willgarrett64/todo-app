// DRAG AND DROP
let originalToDo;
let originalContainer

export const dragStart = (e) => {
  originalToDo = e.target;
  originalContainer = e.target.parentElement;
}

export const dragOver = (e) => {
  e.preventDefault();
}

export const drop = (e) => {
  let newToDo = e.target;
  if (e.target.className !== 'to-do-item') {
    newToDo = e.target.parentElement;
  }

  const newContainer = newToDo.parentElement;
  newContainer.appendChild(originalToDo);
  originalContainer.appendChild(newToDo);
}
