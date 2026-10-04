let board = [];
let newBoard = [];

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let cellSize = 8;
let boardSizeX = Math.floor(canvas.width / cellSize);
let boardSizeY = Math.floor(canvas.height / cellSize);

for (let y = 0; y < boardSizeY; y++) {
  board.push([]);
  newBoard.push([]);
  for (let x = 0; x < boardSizeX; x++) {
    board[y][x] = Math.floor(Math.random() * 5);
    newBoard[y][x] = board[y][x];
  }
}

function getNeighborsWarped(xIndex, yIndex) {
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue;

      let neighborX = xIndex + i;
      let neighborY = yIndex + j;

      let wrappedX = (neighborX % boardSizeX + boardSizeX) % boardSizeX;
      let wrappedY = (neighborY % boardSizeY + boardSizeY) % boardSizeY;

      if (board[wrappedY][wrappedX] == 1) {
        count1++;
      } else if (board[wrappedY][wrappedX] == 2) {
        count2++;
      } else if (board[wrappedY][wrappedX] == 3) {
        count3++;
      } else if (board[wrappedY][wrappedX] == 4) {
        count4++;
      }
    }
  }
  return [count1, count2, count3, count4];
}

function getNewValue(xIndex, yIndex) {
  const [count1, count2, count3, count4] = getNeighborsWarped(xIndex, yIndex);
  const current = board[yIndex][xIndex];
  const totalCount = count1 + count2 + count3 + count4;

  const birthCounts = [3];
  const survivalCounts = [2, 3, 6];

  if (current != 0) {
    if (survivalCounts.includes(totalCount)) {
      return current;
    } else {
      return 0;
    }
  } else {
    if (birthCounts.includes(totalCount)) {
      const counts = [
        { color: 1, count: count1 },
        { color: 2, count: count2 },
        { color: 3, count: count3 },
        { color: 4, count: count4 }
      ];

      counts.sort((a, b) => b.count - a.count);

      const topCount = counts[0].count;
      const secondCount = counts[1].count;

      if (topCount > secondCount) {
        return counts[0].color;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}


let lastTime = 0;
const interval = 30;

function draw(timestamp) {
  let delta = timestamp - lastTime;
  if (delta > interval) {
    lastTime = timestamp - (delta % interval);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < boardSizeY; y++) {
      for (let x = 0; x < boardSizeX; x++) {
        let newVal = getNewValue(x, y);

        newBoard[y][x] = newVal;

        if (newVal == 1) {
          ctx.fillStyle = 'rgb(255, 0, 0)';
          drawCircle(x * cellSize, y * cellSize, cellSize/2);
        } else if (newVal == 2) {
          ctx.fillStyle = 'rgb(0, 255, 0)';
          drawCircle(x * cellSize, y * cellSize, cellSize/2);
        } else if (newVal == 3) {
          ctx.fillStyle = 'rgb(0, 0, 255)';
          drawCircle(x * cellSize, y * cellSize, cellSize/2);
        } else if (newVal == 4) {
          ctx.fillStyle = 'rgb(255, 255, 0)';
          drawCircle(x * cellSize, y * cellSize, cellSize/2);
        }
      }
    }

    let temp = board;
    board = newBoard;
    newBoard = temp;
  }

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);