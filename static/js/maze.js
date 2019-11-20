function recursiveDivisionMaze(start, end, gridSize){

    /*function to divide the given area recursively until the required resolution is reached */
    async function divide(minx, miny, width, height, orientation) {
        if (orientation === 'horizontal') {
            if (width - minx < 2) {
                return;
            }

            let y = Math.floor(randomPoint(miny, height) / 2) * 2;
            addWall(minx, width, y, true);
            await sleep(500);
            divide(minx, miny, width, y-1, 'vertical');
            divide(minx, y + 1, width, height, 'vertical');
        } else {
            if (height - miny < 2) {
                return;
            }
            let x = Math.floor(randomPoint(minx, width) / 2) * 2;
            addWall(miny, height, x, false);
            await sleep(500);
            divide(minx, miny, x-1, height, 'horizontal');
            divide(x + 1, miny, width, height, 'horizontal');
        }
    }
    divide(0, 0, gridSize[0]-1, gridSize[1]-1, chooseOrientation(gridSize[0], gridSize[1]))
}

async function addWall(min, max, perp, h) {
    let hole = Math.floor(randomPoint(min, max) / 2) * 2 + 1;

    for (let i = min; i <= max; i++) {
        if (!(i === hole)) {
            let nodeID;
            if (h) {
                nodeID = i.toString() + '-' + perp.toString();
            } else {
                nodeID = perp.toString() + '-' + i.toString();
            }
            await sleep(100);
            const node = document.getElementById(nodeID);
            if (!node.classList.contains('start') && !node.classList.contains('end')){
                node.classList.add('wall');
            }
        }
    }
}

function randomPoint(min, max) {
    return Math.floor(Math.random() * (max - min) + min + 1);
}

function chooseOrientation(width, height) {
    if (width < height) {
        return "horizontal"
    }
    if (height < width) {
        return 'vertical'
    } else {
        return Math.round(Math.random()) ? 'horizontal' : 'vertical';
    }
}

function DFSMaze(start, end, gridSize) {
    /* No diagonal moves */
    let neighbors = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    /* mark all nodes as walls */
    for (let i=0; i<gridSize[0];i++){
        for (let j=0; j<gridSize[1];j++){
            const nodeID = i.toString() + '-' + j.toString();
            if (nodeID !== start){
                document.getElementById(nodeID).classList.add('wall');
            }
        }
    }

    /* Dict to retrace steps */
    let cameFrom = {};

    /* Mark nodes that have been discovered */
    let discovered = {};
    discovered[start] = true;

    /* Recursive function to move through wall nodes, removing walls unless it would open a path between two non-walls */
    async function recursiveDFS(graph, nodeID) {
        const nodeCoords = nodeID.split('-').map(Number);
        const randIndex = randomIndex(neighbors.length);
        const randNeighbor = neighbors[randIndex];
        neighbors.splice(randIndex, 1);
        neighbors.unshift(randNeighbor);
        for (const coords of neighbors) {
            const neighborCoords = [nodeCoords[0] + coords[0], nodeCoords[1] + coords[1]];
            const gridCheck1 = (neighborCoords[0] > -1 && neighborCoords[0] < gridSize[0]);
            const gridCheck2 = (neighborCoords[1] > -1 && neighborCoords[1] < gridSize[1]);
            if (gridCheck1 && gridCheck2) {
                const neighborID = neighborCoords[0].toString() + "-" + neighborCoords[1];
                const neighborNode = document.getElementById(neighborID);
                const discoveredCheck = dictGet(graph, neighborID, false);
                const wallCheck = neighborNode.classList.contains('wall');
                if (!discoveredCheck && wallCheck) {
                    graph[neighborID] = true;
                    cameFrom[neighborID] = nodeID;
                    if (checkNeighbors(neighbors, neighborID)) {
                        await sleep(25);
                        neighborNode.classList.remove('wall');
                        return recursiveDFS(graph, neighborID);
                    }
                }
            }
        }
        if (typeof (cameFrom[nodeID]) === 'string') {
            return recursiveDFS(graph, cameFrom[nodeID]);
        }
        document.getElementById(end).classList.remove('wall');
    }
    recursiveDFS(discovered, start).then();
}

function checkNeighbors(neighbors, nodeID){
    let i = 0;
    for (const coords of neighbors) {
        const nodeCoords = nodeID.split('-').map(Number);
        const neighborCoords = [nodeCoords[0] + coords[0], nodeCoords[1] + coords[1]];
        const gridCheck1 = (neighborCoords[0] > -1 && neighborCoords[0] < gridSize[0]);
        const gridCheck2 = (neighborCoords[1] > -1 && neighborCoords[1] < gridSize[1]);
        if (gridCheck1 && gridCheck2) {
            const neighborID = neighborCoords[0].toString() + "-" + neighborCoords[1];
            const neighborNode = document.getElementById(neighborID);
            if (!neighborNode.classList.contains('wall')) {
                i += 1;
            }
        }
    }
    return (i < 2)
}

function randomIndex(arrLen){
    return Math.floor(Math.random() * arrLen)
}