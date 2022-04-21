const gameContainer = document.getElementById("game");
const gameButton = document.querySelector('#startGameBTN');
const buttonLayout = document.querySelector('#BTNs');
const totalClicksSpan = document.querySelector('#total-clicks');
const bestTotalScore = document.querySelector('#best-score');


const COLORS = [];

let clickCooldown = false;
let colorCount = 0;
let color1 = null;
let color2 = null;
let gameStarted = false;
let totalClicks = 0;


let bestScore = localStorage.getItem('bestScore');
bestTotalScore.innerText = bestScore;


gameButton.addEventListener('click', () => {
  gameStarted = true;
}, {once: true});

function generateColors(amount){
  for(let i = 0; i < amount; i++){
    let randomColor = Math.floor(Math.random()* 16777215).toString(16);
    COLORS.push(randomColor);
    COLORS.push(randomColor);
  }
}
generateColors(7);


function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);

    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);


function createDivsForColors(colorArray) {
  for (let color of colorArray) {

    const newDiv = document.createElement("div");

    newDiv.classList.add(color);

    newDiv.addEventListener("click", handleCardClick);

    gameContainer.append(newDiv);
  }
}


function handleCardClick(event) {
  if(gameStarted === false) return; 
  if(clickCooldown === true) return;
  if(event.target.classList.contains('revealed')) return;
  event.target.style.backgroundColor = `#${event.target.classList[0]}`;

  if(!color1 || !color2){
    event.target.classList.add('revealed');
    color1 = color1 || event.target;
    color2 = color1 === event.target ? null : event.target;
  }


  totalClicks += 1;
  totalClicksSpan.innerText = totalClicks;

  if(color1 && color2){
    clickCooldown = true;
      if(color1.classList[0] === color2.classList[0]){

      color1.removeEventListener("click", handleCardClick());
      color2.removeEventListener("click", handleCardClick());

      colorCount = colorCount + 2;

      color1 = null;
      color2 = null;
      clickCooldown = false;
    } else{
      setTimeout(() => {
        color1.style.backgroundColor = "";
        color2.style.backgroundColor = "";

        color1.classList.remove('revealed');
        color2.classList.remove('revealed');

        color1 = null;
        color2 = null;
        clickCooldown = false;
      }, 1000);
    }

    if(colorCount === COLORS.length){
      const restartBTN = document.createElement("BUTTON");
      restartBTN.innerText = "Restart";

      if(bestScore){
        if(bestScore > totalClicks){
          localStorage.setItem('bestScore', totalClicks);
          bestTotalScore.innerText = totalClicks;
          console.log('Updating bestTotalScore')
        } 
      } else {
        localStorage.setItem('bestScore', totalClicks);
      }

      restartBTN.addEventListener("click", () => {
       window.location.reload();
      });

      buttonLayout.append(restartBTN);
      return alert("You Won!");
    } 
  }
}

function checkLocalStorage(){

}

// when the DOM loads
createDivsForColors(shuffledColors);

/* */