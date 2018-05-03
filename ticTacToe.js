const board = document.querySelectorAll(".board");
const combos = [ 
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2] 
];

let combCheck;
const combCheckFunc = () => combCheck = combos.slice(0);

let plrBoardArr = [];
let compBoardArr = [];
let player;
let computer;
let attempt;

function resetFunc() {
    document.querySelector("#endGame").style.display = "none";
    document.querySelector("#startGame").style.display = "inline";
    for (let i = 0; i < board.length; i++) {
        board[i].innerHTML = "";
        board[i].style.backgroundColor = "black";
    } 
    plrBoardArr = [];
    compBoardArr = [];
}

function xFunc() {
    document.querySelector("#startGame").style.display = "none";
    player = "X";
    computer = "O";
    staging();
}

function oFunc() {
    document.querySelector("#startGame").style.display = "none";
    player = "O";
    computer = "X";
    staging();
}

function staging() {
    combCheckFunc();
    for (let i = 0; i < board.length; i++) {
        board[i].addEventListener("click", playerTurn, false);
    }
}

function playerTurn(event) {
    for (let i = 0; i < board.length; i++) {
        if (event.target.id == board[i].id && board[i].innerHTML == "") {
            board[event.target.id].innerHTML = player;
            plrBoardArr.push(parseInt(event.target.id));
            
            for (let i = 0; i < board.length; i++) {
                board[i].removeEventListener("click", playerTurn, false);
            } 
            gameCheck(plrBoardArr);
        }
    } 
}

function compTurn() {
    if (plrBoardArr.length === 5) {
        return gameOver(plrBoardArr);
    }
    attempt = false;
    combCheckFunc();

    compSpace(computer);
    if (attempt === true) {
        return gameCheck(compBoardArr);
    }
    combCheckFunc();
    compSpace(player);
    if (attempt === true) {
        return gameCheck(compBoardArr);
    } 
    combCheckFunc();
    compOpenSpace();
    return gameCheck(compBoardArr);
}

function compSpace(square) {
    if (combCheck.length === 0) {
        return;
    }
    let testArr = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i].innerHTML === square) {
            testArr.push(parseInt(board[i].id));
        }
    }
    testArr = testArr.filter(ele => ele === combCheck[0][0] || ele === combCheck[0][1] || ele === combCheck[0][2]);
    if (testArr.length === 2) {
        for (let i = 0; i < combCheck[0].length; i++) {
            if (testArr.indexOf(combCheck[0][i]) === -1 && board[combCheck[0][i]].innerHTML === "") {
                board[combCheck[0][i]].innerHTML = computer;
                compBoardArr.push(parseInt(board[combCheck[0][i]].id));
                attempt = true;
                return;
            }
        }
    }
    combCheck.splice(0, 1);
    compSpace(square);
}

function compOpenSpace() {
    let boardTest = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    boardTest.filter(ele => board[ele].innerHTML !== computer);
    if (combCheck.length === 0) {
        let diagonals = [0, 2, 6, 8];
        let horizontals = [1, 3, 5, 7];
        let horizonArr = horizontals.slice(0);
        diagonals = diagonals.filter(ele => board[ele].innerHTML !== player);
        horizontals = horizontals.filter(ele => board[ele].innerHTML !== player);
        if (board[4].innerHTML === player && board[0].innerHTML === "") {
            board[0].innerHTML = computer;
            compBoardArr.push(parseInt(board[0].id));
            return;
        }
        else if (diagonals.length === 3 && board[4].innerHTML === "") {
            board[4].innerHTML = computer;
            compBoardArr.push(parseInt(board[4].id));
            return;
        } else if (horizontals.length === 3) {
            for (let i = 0; i < horizonArr.length; i++) {
                if (horizontals.indexOf(horizonArr[i]) === -1) {
                    if (horizonArr[i] === 1 || horizonArr[i] === 3 && board[0].innerHTML === "") {
                        board[0].innerHTML = computer;
                        compBoardArr.push(parseInt(board[0].id));
                        return;
                    } else if (horizonArr[i] === 5 && board[2].innerHTML === "") {
                        board[2].innerHTML = computer;
                        compBoardArr.push(parseInt(board[2].id));
                        return;
                    } else if (horizonArr[i] === 7 && board[1].innerHTML === ""){
                        board[1].innerHTML = computer;
                        compBoardArr.push(parseInt(board[1]).id);
                        return;
                    }
                }
            }
        } else { 
            for (let i = 0; i < board.length; i++) {
                if (board[i].innerHTML === "") {
                    board[i].innerHTML = computer;
                    compBoardArr.push(parseInt(board[i].id));
                    console.log("goteee");
                    return;
                } 
            }
        } 
    }
    let plrTest = false;
    let testArr = [];
    for (let i = 0; i < combCheck[0].length; i++) {
        if (board[combCheck[0][i]].innerHTML === player) {
            plrTest = true;
        }
    }
    for (let i = 0; i < combCheck[0].length; i++) {
        if (board[combCheck[0][i]].innerHTML === computer && plrTest === true) {
            testArr = combCheck[0].slice(0);
            console.log(testArr);
        }
    }
    for (let i = 0; i < testArr.length; i++) {
        if (board[testArr[i]].innerHTML === "" && testArr.length === 3) {
            board[testArr[i]].innerHTML = computer;
            compBoardArr.push(parseInt(testArr[i]));
            return;
        }
    }
    combCheck.splice(0, 1);
    compOpenSpace();
}

function gameCheck(arr) {
    if (combCheck.length === 0 && arr === plrBoardArr) {
        return compTurn();
    }
    if (combCheck.length === 0 && arr === compBoardArr) {
        return staging();
    }
    let testArr = [];
    for (let i = 0; i < combCheck[0].length; i++) {
        if (arr.indexOf(combCheck[0][i]) !== -1) {
            testArr.push(combCheck[0][i]);
        }
    }
    if (testArr.length === 3) {
        return gameOver(testArr);
    }
    combCheck.splice(0, 1);
    gameCheck(arr);
}

function gameOver(arr) {
    let score = "";
    document.querySelector("#endGame").style.display = "inline";
    if (arr.length === 5) {
        document.querySelector("#endGame").innerHTML = "It's a Draw! Click the New Game Button to play again.";
        for (let i = 0; i < board.length; i++) {
            board[i].style.backgroundColor = "gray";
        }
        drawsVal.value++;
        return;
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            if (board[i].id == arr[j] && board[i].innerHTML === player) {
                board[i].style.backgroundColor = "purple";
                document.querySelector("#endGame").innerHTML = "You win! Click the New Game Button to play again.";
                score = player;
            }
            if (board[i].id == arr[j] && board[i].innerHTML === computer) {
                board[i].style.backgroundColor = "red";
                document.querySelector("#endGame").innerHTML = "Computer wins. Click the New Game Button to play again.";
                score = computer;
            }
        }
    }
    if (score === player) {
        playerVal.value++;
    } else if (score === computer) {
        computerVal.value++;
    } 
}



/*
        else if (board[4].innerHTML === "" && boardTest.length < 8) {
            board[4].innerHTML = computer;
            compBoardArr.push(parseInt(board[4]).id);
            return;
        }
        */



