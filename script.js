var board;
const computer='O';
const human='X';
let difficulty="easy";
let dp={};
const winning_combination=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]
const cells=document.querySelectorAll('.cell');
startGame();
//Reseting the Board
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    dp={};
    board = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function changeDifficulty(){
    const difficultySelect = document.getElementById("difficulty");
    const selectedDifficulty = difficultySelect.value;
    difficulty = selectedDifficulty;
    startGame();
}

// Starts Turns Based on Human Click
function turnClick(square) {
    if (typeof board[square.target.id] == 'number') {
        var ch=turn(square.target.id,human)
        if (!checkTie() && ch==0) {
			setTimeout(function() {
			  	turn(bestSpot(), computer);
			},100);
        }
    }
}
// Executes Turn
function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let win = checkWinner(board, player);
    if (win) {
        gameOver(win);
        return 1;
    }
    return 0;
}

// Checks for a Winner
function checkWinner(mimic_board, player) {
    let winner = null;
    let plays = [];
    for (let i = 0; i < mimic_board.length; i++) {
        if (mimic_board[i] === player) {
            plays.push(i);
        }
    }
    for (let i = 0; i < winning_combination.length; i++) {
        if (plays.includes(winning_combination[i][0]) && plays.includes(winning_combination[i][1]) &&
            plays.includes(winning_combination[i][2])) {
            winner = { i, player };
            break;
        }
    }
    return winner;
}

// Stops the game and outputs result
function gameOver(winner) {
    for (let i of winning_combination[winner.i]) {
        document.getElementById(i).style.backgroundColor
         = winner.player == human ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(winner.player == human ? "You Win!" : "You Lose :(");
}

// Outputs Result
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame").style.opacity = "0.4";
	document.querySelector(".endgame .text").innerText = who;
}
// Computer uses minimax algorithm to find the best spot
function bestSpot() {
    if(difficulty=="easy"){
        return Easy(board,computer);
    }
    else if(difficulty=="medium"){
        return Medium(board,computer);
    }
    else{
         return minimax(board,computer,0).index;
    }
}
// Checking for any tie
function checkTie() {
    var ct=0;
    for(var i=0;i<9;i++){
        if(typeof board[i] =='number') ct++;
    }
    var ch=checkWinner(board,human);
	if (ct==0 && ch==null) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//It will give the return the other player
function otherplayer(player){
    return ('O'+'X').replace(player,"");
}

function generateDpKey(board, player){
    return board.join('')+player;
}
// Minimax Algorithm
function minimax(mimic_board, player,isMedium) {
    let dpKey=generateDpKey(mimic_board,player);
    if(dp.hasOwnProperty(dpKey)) {
        return dp[dpKey];
    }    
    var ct=0;
    for(var i=0;i<9;i++){
        if(typeof mimic_board[i] =='number') ct++;
    }
	if (checkWinner(mimic_board, human)) {
		return {score: -10};
	} else if (checkWinner(mimic_board,computer)) {
		return {score: 10};
	} else if (ct==0) {
		return {score: 0};
	}
    if(isMedium==2) return {score:0};
	let best_move =-1;
    let best_score=Infinity;
    if(player==computer) best_score=-Infinity;
	for (let i = 0; i <9; i++) {
        if(typeof mimic_board[i]!='number') continue;
		let move=mimic_board[i];
		mimic_board[i] = player;
        let nIsMedium=isMedium;
        if(nIsMedium==1) nIsMedium++;
        let temp= minimax(mimic_board,otherplayer(player),nIsMedium);
        if(temp.score>best_score && player==computer){
              best_score=temp.score;
              best_move=move;
        }
        if(temp.score<=best_score && player==human){
            best_score=temp.score;
            best_move=move;
        }
		mimic_board[i] = move;
	}
	dp[dpKey]={index:best_move,score:best_score};
    return dp[dpKey];
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  
function getIndex(openspot){
   const len=openspot.length;
   return openspot[getRandomInt(0,len-1)];
}
function Medium(mimic_board,player){
 const res1=minimax(mimic_board,otherplayer(player),1);
 const res2=minimax(mimic_board,player,1);
 if(res1.score==-10 && res2.score!=10){
       return res1.index;     
 }

 if(res2.score==10){
    return res2.index;
 }
const openspot=emptySquares();
const isNumber4Present = openspot.includes(4);

if(isNumber4Present) {
  for(let i=0;i<6;i++){
    openspot.push(4);
  }
}
 return getIndex(openspot);
}
function Easy(mimic_board, player) {
   let openspot=emptySquares();
   return getIndex(openspot);
}