"use strict";

const GRID_WIDTH = 30;
const GRID_HEIGHT = 20;

let grid = [];
let foodPosition = [];
window.addEventListener("load", startGame);

// =====================MODEL====================//
function createGrid() {
  grid = [];
  const container = document.getElementById("grid");
  container.innerHTML = "";
  for (let i = 0; i < GRID_HEIGHT; i++) {
    const row = [];
    for (let j = 0; j < GRID_WIDTH; j++) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");

      container.appendChild(cellElement);
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}

class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.next = null;
  }
}

class Queue {
  constructor() {
    (this.head = null), (this.tail = null);
  }

  enqueue(x, y) {
    const newSnake = new Snake(x, y);

    if (!this.head) {
      this.head = newSnake;
      this.tail = newSnake;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newSnake; 
      this.tail = newSnake; 
    }
  }

  dequeue() {
    if (!this.head) {
      return null;
    }
    const { x, y } = this.head;

    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }
    return { x, y };
  }

  peek() {
    if (!this.head) {
      console.log("there is nothing here");
      return null;
    }
    const { x, y } = this.head;
    return { x, y };
  }
}

const startX = Math.floor(GRID_WIDTH / 2);
const startY = Math.floor(GRID_HEIGHT / 2);

const queue = new Queue();

queue.enqueue(startX, startY);
const DIRECTIONS = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

let direction = DIRECTIONS.RIGHT;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      if (direction !== DIRECTIONS.DOWN) direction = DIRECTIONS.UP;
      break;
    case "ArrowDown":
      console.log("ArrowDown");
      if (direction !== DIRECTIONS.UP) direction = DIRECTIONS.DOWN;
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      if (direction !== DIRECTIONS.RIGHT) direction = DIRECTIONS.LEFT;
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      if (direction !== DIRECTIONS.LEFT) direction = DIRECTIONS.RIGHT;
      break;
  }
});

function moveSnake() {
  let currentSnake = queue.head;
  let newX, newY;

  while (currentSnake !== null) {
    newX = currentSnake.x;
    newY = currentSnake.y;

    // giver den  nuværende snakes coordinater videre til den næste snake
    if (currentSnake.next !== null) {
      currentSnake.x = currentSnake.next.x;
      currentSnake.y = currentSnake.next.y;
    } else {
      switch (direction) {
        case DIRECTIONS.UP:
          currentSnake.y = (currentSnake.y - 1 + GRID_HEIGHT) % GRID_HEIGHT;
          break;
        case DIRECTIONS.DOWN:
          currentSnake.y = (currentSnake.y + 1) % GRID_HEIGHT;
          break;
        case DIRECTIONS.LEFT:
          currentSnake.x = (currentSnake.x - 1 + GRID_WIDTH) % GRID_WIDTH;
          break;
        case DIRECTIONS.RIGHT:
          currentSnake.x = (currentSnake.x + 1) % GRID_WIDTH;
          break;
        default:
          break;
      }
    }

    currentSnake = currentSnake.next;
  }
}

function updateGrid() {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      if (grid[row][col] === 1) {
        /* console.log(` fjerner snake på  row ${row}, col ${col}`); */
        grid[row][col] = 0;
      }
    }
  }


  let currentNode = queue.head;
  console.log(currentNode + "this is the head of the snake");
  while (currentNode) {
    /*  console.log(`opdatere grid med ny snakes coordinater x ${currentNode.x}, y ${currentNode.y}`); */
    grid[currentNode.y][currentNode.x] = 1;
    currentNode = currentNode.next;
  }

  if (foodPosition[0] !== undefined && foodPosition[1] !== undefined) {
    const [fx, fy] = foodPosition;
    /* console.log(`food location :  x ${fx}, y ${fy}`); */
    grid[fx][fy] = 2;
  } else {
    console.error("Food position is undefined.");
  }
}
 // ===================== food related =====================
function spawnFood() {
  const y = Math.floor(Math.random() * GRID_HEIGHT);
  const x = Math.floor(Math.random() * GRID_WIDTH);

  foodPosition = [y, x];
  updateGrid();
  return foodPosition;
}

function eatFood() {
  const { x: headX, y: headY } = queue.peek();

  if (headX === foodPosition[1] && headY === foodPosition[0]) {
    console.log("Food eaten!");
    spawnFood();

    let currentSegment = queue.head;
    while (currentSegment.next !== null) {
      currentSegment = currentSegment.next;
    }
      // improvements here.. jeg fatter ikke hvorfor at queuen bliver kaldt når food bliver spist men visuelt kommer der først ekstra led på 4-5 celler eftter food.
    console.log("adding the new snake segment");
    queue.enqueue(currentSegment.x, currentSegment.y);
    console.log("segment added");
  }
}

//======================VIEW================= ======//

function displayBoard() {
  const container = document.getElementById("grid");
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cellElement = container.children[row * GRID_WIDTH + col];

      switch (grid[row][col]) {
        case 0:
          cellElement.classList.remove("snake");
          cellElement.classList.remove("food");
          break;
        case 1:
          cellElement.classList.add("snake");
          cellElement.classList.remove("food");
          break;
        case 2:
          cellElement.classList.add("food");
          break;
        default:
      }
    }
  }
}

//======================CONTROLLER=================//

function startGame() {
  console.log("javescript kører");
  createGrid();
  spawnFood();
  grid[startY][startX] = 1;
  tick();
}

function tick() {
  moveSnake();
  updateGrid();
  eatFood();
  displayBoard();

  setTimeout(() => tick(grid), 500);
}
