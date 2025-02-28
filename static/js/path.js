const algorithms = ['A*', 'Dijkstra', 'Breadth First Search', 'Depth First Search'];
addSelectOptions(algorithms, 'algorithmSelect', "Choose Algorithm");

const mazes = ['Recursive Division', 'Depth First Search'];
addSelectOptions(mazes, 'mazeSelect', "Choose Maze");

let gridSize = [15, 40];
let grid = clickableGrid(gridSize[0], gridSize[1], cellClicked);

var mouseDown = false;
var pathStart;
var pathEnd;
document.addEventListener('mousedown', setLeftMouseDown);
document.addEventListener('mouseup', setLeftMouseDown);
document.addEventListener('mouseover', setLeftMouseDown);

document.getElementById('run').addEventListener('click', runAlgorithm);
document.getElementById('resetGrid').addEventListener('click', resetGrid);
document.getElementById('algorithmSelect').addEventListener('change', updateNotes);

document.getElementById('mazeSelect').addEventListener('change', createMaze);

function updateNotes(e) {
    const noteLabel = document.getElementById('notes');
    switch (e.target.value) {
        case 'A*':
            noteLabel.innerHTML = "Gives the shortest path, uses location of end node to speed up run time.";
            break;
        case 'Dijkstra':
            noteLabel.innerHTML = "Gives the shortest path, does not need to know end node location at start.";
            break;
        case "Breadth First Search":
        case "Depth First Search":
            noteLabel.innerHTML = "Does not attempt to find the shortest path. Does not need to know end location at start.";
            break;
    }
}

function resetGrid() {
    pathStart = NaN;
    pathEnd = NaN;
    grid.parentNode.removeChild(grid);
    grid = clickableGrid(gridSize[0], gridSize[1], cellClicked);
}

function clearWalls() {
    for (let i=0; i<gridSize[0];i++){
        for (let j=0; j<gridSize[1];j++){
            const nodeID = i.toString() + '-' + j.toString();
            const node = document.getElementById(nodeID);
            if (node.classList.contains('start')){
                node.className = 'start';
            } else if (node.classList.contains('end')) {
                node.className = 'end';
            } else {
                node.className = '';
            }
        }
    }
}

function createMaze() {
    clearWalls();
    const mazeSelect = document.getElementById('mazeSelect');
    const maze = mazeSelect.options[mazeSelect.selectedIndex].text;
    switch (maze) {
        case 'Recursive Division':
            recursiveDivisionMaze(pathStart.id, pathEnd.id, gridSize);
            break;
        case 'Depth First Search':
            DFSMaze(pathStart.id, pathEnd.id, gridSize);
            break;
    }
}

function addSelectOptions(options, selectID, text) {
    const dropdown = document.getElementById(selectID);
    options.forEach(item => {
        let option = document.createElement('option');
        option.text = item;
        dropdown.add(option);
    });
    const defOption = document.createElement('option');
    defOption.text = text;
    defOption.selected = true;
    defOption.disabled = true;
    defOption.hidden = true;
    dropdown.add(defOption);
}

function runAlgorithm() {
    const algorithm = document.getElementById('algorithmSelect');
    const alg = algorithm.options[algorithm.selectedIndex].text;
    switch (alg) {
        case 'A*':
            aStar(pathStart.id, pathEnd.id, gridSize).then(r => console.log(r));
            break;
        case 'Dijkstra':
            dijkstra(pathStart.id, pathEnd.id, gridSize).then(r => console.log(r));
            break;
        case 'Depth First Search':
            recursiveDFS(pathStart.id, pathEnd.id, gridSize).then(r => console.log(r));
            break;
        case "Breadth First Search":
            BFS(pathStart.id, pathEnd.id, gridSize).then(r => console.log(r));
            break;
    }
}

function setLeftMouseDown(e) {
    mouseDown = e.buttons === undefined ? e.which === 1 : e.buttons === 1;
}

function cellClicked(el, ev) {
    if (!mouseDown && ev === "mouseover") {
        return
    }
    el.classList.contains('wall') ? el.classList.remove('wall') : el.classList.add('wall');
}

function placeStartNode(id) {
    if (id === 'start-image') {
        return
    }
    const newStart = document.getElementById(id);
    if (pathStart) {
        mouseDown = false;
        pathStart.active = true;
        newStart.appendChild(document.getElementById('start-image'));
    } else {
        const image = document.createElement("span");
        image.classList.add('start-image', 'oi');
        image.setAttribute('data-glyph', 'flag');
        image.setAttribute('aria-hidden', 'true');
        image.title = 'Flag';
        image.id = 'start-image';
        image.draggable = true;
        image.addEventListener('dragstart', function(e){
            e.dataTransfer.setData('text/plain', image.id);
        }, true);
        newStart.appendChild(image);
    }

    newStart.removeEventListener('mousedown', setLeftMouseDown);
    newStart.removeEventListener('mouseover', setLeftMouseDown);
    pathStart = newStart;
    pathStart.classList.remove('wall');
    pathStart.classList.add('start');
    pathStart.active = false;
}

function placeEndNode(id) {
    if (id === 'end-image') {
        return
    }
    const newEnd = document.getElementById(id);
    if (pathEnd) {
        mouseDown = false;
        pathEnd.active = true;
        newEnd.appendChild(document.getElementById('end-image'));
    } else {
        const image = document.createElement("span");
        image.classList.add('end-image', 'oi');
        image.setAttribute('data-glyph', 'star');
        image.setAttribute('aria-hidden', 'true');
        image.id = 'end-image';
        image.title = 'Star';
        image.draggable = true;
        image.addEventListener('dragstart', function(e){
            e.dataTransfer.setData('text/plain', image.id);
        }, true);
        newEnd.appendChild(image);
    }

    newEnd.removeEventListener('mousedown', setLeftMouseDown);
    newEnd.removeEventListener('mouseover', setLeftMouseDown);
    pathEnd = newEnd;
    pathEnd.classList.remove('wall');
    pathEnd.classList.add('end');
    pathEnd.active = false;
}

function placeDefaults(rows, cols) {
    const startLoc = "1-1";
    const endLoc = (rows - 2).toString() + '-' + (cols - 2).toString();

    placeStartNode(startLoc);
    placeEndNode(endLoc);
}

function changePositions(e) {
    const data = e.dataTransfer.getData("text/plain");
    const id = e.target.id;
    if (data === 'start-image') {
        placeStartNode(id);
    }
    if (data === 'end-image') {
        placeEndNode(id);
    }
}

function clickableGrid(rows, cols, callback) {
    let grid = document.createElement('table');
    grid.className = 'grid';
    for (let r=0; r<rows; ++r) {
        const tr = grid.appendChild(document.createElement('tr'));
        for (let c=0; c<cols;++c){
            const cell = tr.appendChild(document.createElement('td'));
            cell.id = r.toString() + "-" + c.toString();
            cell.addEventListener('mouseover', ((cell) => (event) => {
                callback(cell, event.type);
            })(cell), false);
            cell.addEventListener('mousedown', ((cell) => (event) => {
                callback(cell, event.type);
            })(cell), false);
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
            }, true);
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                changePositions(e);
            }, true);
        }
    }
    document.body.appendChild(grid);
    placeDefaults(rows, cols);
    return grid;
}