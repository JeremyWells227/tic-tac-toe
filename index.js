


function createEmptyElement(x,y){
	id = `${x}_${y}`
	cell = document.getElementById(id)
	cell.innerHTML = "";
}

function createXElement(x, y) {
	id = `${x}_${y}`
	cell = document.getElementById(id)
	let x_img = document.createElement("img")
	x_img.src = "./assets/x.png"
	cell.innerHTML = "";
	cell.appendChild(x_img)
}
function createOElement(x, y) {
	id = `${x}_${y}`
	cell = document.getElementById(id)
	let o_img = document.createElement("img")
	o_img.src = "./assets/o.png"
	cell.innerHTML = "";
	cell.appendChild(o_img)
}

const cellStates = {
	Empty: createEmptyElement,
	X: createXElement,
	O: createOElement,
}

const gameStates = {
	"Free": "Free",
	"Frozen": "Frozen",
}


let gamestate = gameStates['Free'];
let gameboard = [
	[cellStates["Empty"], cellStates["Empty"], cellStates["Empty"]],
	[cellStates["Empty"], cellStates["Empty"], cellStates["Empty"]],
	[cellStates["Empty"], cellStates["Empty"], cellStates["Empty"]],
]
let currPlayer="X"

function resetGameBoard() {
	gameboard = [
	[cellStates["Empty"], cellStates["Empty"], cellStates["Empty"]],
	[cellStates["Empty"], cellStates["Empty"], cellStates["Empty"]],
	[cellStates["Empty"], cellStates["Empty"], cellStates["Empty"]],
	]
	initGameState()
	renderCurrentGameState()

}


function renderCurrentGameState() {
	gameboard.forEach((row,y)=>{
		row.forEach((cellState,x)=>{
			cellState(x,y)
		});
	});
}
function togglePlayer(){
	if (currPlayer==="X"){
		currPlayer="O"
	} else {
		currPlayer="X"
	}
}

function checkForWinner(){
	// Sub-routines

	function checkRow(y){
		let row = gameboard[y]
		let tok = row[0]
		if (tok === cellStates['Empty']){
			return false
		}
		let isWinner=true
		row.forEach((item)=>{
			if(item!==tok || item===cellStates['Empty']){
				isWinner=false
			}
		})
		return isWinner;
	}

	function checkCol(x){
		let rows = gameboard.length	
		let cols=[]
		for (let i=0; i<rows; i++) {
			cols.push(gameboard[i][x])
		}
		let isWinner=true
		tok = cols[0]
		if (tok === cellStates['Empty']){
			return false
		}
		cols.forEach((item)=>{
			if(item!==tok || item===cellStates['Empty']){
				isWinner=false
			}
		})
		return isWinner;
	}


	function checkDiag() {
		// Assume square board
		let diag1 = []
		for (let i=0; i< gameboard.length;i++){
			diag1.push( gameboard[i][i])
		}
		if (diag1.every((x)=>x===cellStates[currPlayer])){
			return true
		}
		let diag2=[]
		for (let i=0; i< gameboard.length;i++){
			diag2.push( gameboard[gameboard.length-1-i][i])
		}
		if (diag2.every((x)=>x===cellStates[currPlayer])){
			return true
		}
		return false
	}
	// End sub-routines

	let winnerFound=false;
	if (checkDiag()){
		winnerFound=true
	}
	if(winnerFound)
		return true;

	gameboard.forEach((_,y)=>{
		if(checkRow(y)){
			winnerFound=true;
		}
	});

	if(winnerFound)
		return true;


	gameboard[0].forEach((_,x)=>{
		if(checkCol(x)){
			winnerFound=true
		}
	})

	if(winnerFound)
		return true;
}

function printWinner(){
	messageBox = document.getElementById("msgbox");
	messageBox.innerHTML="";
	winnerText = document.createElement("p")
	winnerMessage = `${currPlayer} is the winner!`
	winnerText.appendChild(document.createTextNode(winnerMessage))
	messageBox.appendChild(winnerText)
}

function printDraw(){
	messageBox = document.getElementById("msgbox");
	messageBox.innerHTML="";
	drawText = document.createElement("p")
	drawMessage = "Draw!"
	drawText.appendChild(document.createTextNode(drawMessage))
	messageBox.appendChild(drawText)
}

function checkForDraw(){
	isDraw=true
	gameboard.forEach((row)=>{
		if(row.some((x)=>x===cellStates["Empty"]))
			isDraw=false;
	})

	return isDraw;
}

function initGameState() {
	currPlayer = "X";
	gamestate = gameStates['Free']
	resetbtn = document.getElementById("reset")
	reset.addEventListener("click",resetGameBoard);
	gameboard.forEach((row,y)=>{
		row.forEach((_,x)=>{
			id = `${x}_${y}`
			cell= document.getElementById(id);
			cell.removeEventListener("click",()=>{onCellClick(x,y)})
			cell.addEventListener("click",()=>{onCellClick(x,y)})
		});
	});
}

function freezeGameState() {
	gamestate = gameStates['Frozen']
}

function onCellClick(x,y){
	if (gamestate === gameStates['Frozen'])
		return;
	if (gameboard[y][x] !== cellStates["Empty"]){
		return;
	}
	if (currPlayer === "X"){
		gameboard[y][x] = cellStates["X"]
	} else {
		gameboard[y][x] = cellStates["O"]
	}
	
	if(checkForWinner()){
		printWinner();
		renderCurrentGameState()
		freezeGameState()
		return;
	}
	else if(checkForDraw()){
		printDraw()
		renderCurrentGameState()
		freezeGameState()
		return;
	}
	renderCurrentGameState()
	togglePlayer()
}

function editName(div){
	if(!div.classList.contains("edit")){
		div.classList.add("edit")
		currName = div.innerText;
		div.innerText=""
		form = document.createElement("form")
		let nameinput = document.createElement("input");
		nameinput.setAttribute('type', 'text');
		nameinput.setAttribute('name', 'name');
		nameinput.setAttribute('placeholder',currName);
		form.appendChild(nameinput);
		form.addEventListener('submit',(e)=>{
			e.preventDefault();
			div.innerHTML="";
			if(e.target.elements.name.value.length > 0){
				div.innerText=e.target.elements.name.value;
			} else {
				div.innerText=currName;
			}
			div.classList.remove('edit')
		})
		div.appendChild(form)
		nameinput.focus()
	}
}

function registerEditFuncs(){
	name_divs = document.getElementsByClassName('playername')
	for (let div of name_divs){
		div.removeEventListener("click",()=>editName(div))
		div.addEventListener("click",()=>editName(div))
	}
}

window.onload = ()=>{
	resetGameBoard()
	registerEditFuncs()

}
