const cell = document.querySelectorAll(".cell");
const statustxt = document.querySelector("#status");
const rtn = document.querySelector("#rst");
const win = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
];
let options = ["","","","","","","","",""];
let currentply = "X";
let running = false;
game();
function game(){
    cell.forEach(cell => cell.addEventListener("click", cellClick));
    
    rtn.addEventListener("click",reset);
    statustxt.textContent = `${currentply}'s turn`
    running = true;
    }

function cellClick(){
    const cellIndex = this.getAttribute("cellIndex");
    if (options[cellIndex] != ""|| !running){
        return;
    }
    update(this,cellIndex);
    check();
}
function update(cell,index){
    options[index] = currentply;
    cell.textContent = currentply;
}
function change(){
    currentply = (currentply == "X")? "O":"X";
    statustxt.textContent = `${currentply}'s turn`;

}
function check(){
    let won = false;
    let winningCombo = [];
    for (let i = 0; i < win.length; i++) {
        const condition = win[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];
    
        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            won = true;
            winningCombo = condition; // Store the winning combination
            break;
        }
    }
    if (won) {
        statustxt.textContent = `${currentply} wins!`;
        running = false;
        
        // Highlight winning cells
        winningCombo.forEach(index => {
            cell[index].classList.add("winning-cell");
        });
    } else if (!options.includes("")) {
        statustxt.textContent = `It's a draw!`;
        running = false;
    } else {
        change();
    }
}

function reset() {
    currentply = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statustxt.textContent = `${currentply}'s turn`;
    cell.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell"); // Remove animation class
    });
    running = true;
}
