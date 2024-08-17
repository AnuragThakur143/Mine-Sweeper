document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let sqrs = [];
    let isGameOver = false;
  
    //creating Board
    function createBoard() {
      flagsLeft.innerHTML = bombAmount;
  
      //shuffled gamearray with random bombs
      const bombsArray = Array(bombAmount).fill('bomb');
      const emptyArray = Array(width*width - bombAmount).fill('valid');
      const gameArray = emptyArray.concat(bombsArray);
      const shuffledArray = gameArray.sort(() => Math.random() -0.5);
  
      for(let i = 0; i < width*width; i++) {
        const sqr = document.createElement('div');
        sqr.setAttribute('id', i);
        sqr.classList.add(shuffledArray[i]);
        grid.appendChild(sqr);
        sqrs.push(sqr);
  
        //normal click
        sqr.addEventListener('click', function(e) {
          click(sqr);
        });
  
        //cntrl click
        sqr.oncontextmenu = function(e) {
          e.preventDefault();
          addFlag(sqr);
        }
      }
  
      //add numbers
      for (let i = 0; i < sqrs.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width -1);
  
        if (sqrs[i].classList.contains('valid')) {
          if (i > 0 && !isLeftEdge && sqrs[i -1].classList.contains('bomb')) total ++;
          if (i > 9 && !isRightEdge && sqrs[i +1 -width].classList.contains('bomb')) total ++;
          if (i > 10 && sqrs[i -width].classList.contains('bomb')) total ++;
          if (i > 11 && !isLeftEdge && sqrs[i -1 -width].classList.contains('bomb')) total ++;
          if (i < 98 && !isRightEdge && sqrs[i +1].classList.contains('bomb')) total ++;
          if (i < 90 && !isLeftEdge && sqrs[i -1 +width].classList.contains('bomb')) total ++;
          if (i < 88 && !isRightEdge && sqrs[i +1 +width].classList.contains('bomb')) total ++;
          if (i < 89 && sqrs[i +width].classList.contains('bomb')) total ++;
          sqrs[i].setAttribute('data', total);
        }
      }
    };
    createBoard();
  
    //add Flag]
    function addFlag(sqr) {
      if (isGameOver) return;
      if (!sqr.classList.contains('checked') && (flags < bombAmount)) {
        if (!sqr.classList.contains('flag')) {
          sqr.classList.add('flag');
          sqr.innerHTML = ' 🚩';
          flags ++;
          flagsLeft.innerHTML = bombAmount- flags;
          checkWin();
        } else {
          sqr.classList.remove('flag');
          sqr.innerHTML = '';
          flags --;
          flagsLeft.innerHTML = bombAmount- flags;
        }
      }
    };
  
    //click ]actions
    function click(sqr) {
      let currentId = sqr.id;
      if (isGameOver) return;
      if (sqr.classList.contains('checked') || sqr.classList.contains('flag')) return;
      if (sqr.classList.contains('bomb')) {
        gameOver(sqr);
      } else {
        let total = sqr.getAttribute('data');
        if (total !=0) {
          sqr.classList.add('checked');
          if (total == 1) sqr.classList.add('one');
          if (total == 2) sqr.classList.add('two');
          if (total == 3) sqr.classList.add('three');
          if (total == 4) sqr.classList.add('four');
          sqr.innerHTML = total;
          return;
        }
        checkSquare(sqr, currentId);
      }
      sqr.classList.add('checked');
    };
  
  
    //check neighboring square
    function checkSquare(sqr, currentId) {
      const isLeftEdge = (currentId % width === 0);
      const isRightEdge = (currentId % width === width -1);
  
      setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
          const newId = sqrs[parseInt(currentId) -1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = sqrs[parseInt(currentId) +1 -width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 10) {
          const newId = sqrs[parseInt(currentId -width)].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = sqrs[parseInt(currentId) -1 -width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = sqrs[parseInt(currentId) +1].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = sqrs[parseInt(currentId) -1 +width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = sqrs[parseInt(currentId) +1 +width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId < 89) {
          const newId = sqrs[parseInt(currentId) +width].id;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
      }, 10);
    };
  
    //game over
    function gameOver(sqr) {
      result.innerHTML = 'BOOM! Game Over!';
      isGameOver = true;
  
      //show all bombs
      sqrs.forEach(sqr => {
        if (sqr.classList.contains('bomb')) {
          sqr.innerHTML = '💣';
          sqr.classList.remove('bomb');
          sqr.classList.add('checked');
        }
      });
    };
  
    //check win
    function checkWin() {
    let matches = 0;
  
      for (let i = 0; i < sqrs.length; i++) {
        if (sqrs[i].classList.contains('flag') && sqrs[i].classList.contains('bomb')) {
          matches ++;
        }
        if (matches === bombAmount) {
          result.innerHTML = 'YOU WIN!\nYOU ARE MINNER⛏️';
          isGameOver = true;
        }
      };
    };
  });