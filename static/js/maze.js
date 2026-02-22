function recursiveDivisionMaze(start, end, gridSize){

    /*function to divide the given area recursively until the required resolution is reached */
    async function divide(x, y, width, height, orientation) {
        if (width < 2 || height < 2){return}
        if (orientation === 'horizontal') {
            
            let ny
            for (i = 0; i<50; i++){
                ny = y + randomPoint(height - 2) + 1
                if (checkHole(x, width, ny, true, gridSize)){
                    addWall(x, width, ny, true);
                    break
                }
            }
            
            await sleep(500);
            let h = ny - y
            divide(x, y, width, h, chooseOrientation(width, h));

            h = y + height - ny - 1
            divide(x, ny + 1, width, h, chooseOrientation(width, h));
        } else {

            let nx
            for (i = 0; i<50; i++){
                nx = x + randomPoint(width - 2) + 1
                if (checkHole(y, height, nx, false, gridSize)){
                    addWall(y, height, nx, false);
                    break
                }
            }

            await sleep(500);

            let w = nx - x
            divide(x, y, w, height, chooseOrientation(w, height));

            w = x + width - nx - 1
            divide(nx + 1, y, w, height, chooseOrientation(w, height));
        }
    }
    divide(0, 0, gridSize[0], gridSize[1], chooseOrientation(gridSize[0], gridSize[1]))
}

function checkHole(start, len, perp, h, gridSize) {
    let check1 = false;
    let check2 = false;
    const limit = h ? gridSize[0] : gridSize[1]
    /* check the beginning of the wall */
    if (start === 0) {check1 = true} else {
        const node1check = !document.getElementById(getElementWithDir(start - 1, perp, h)).classList.contains('wall');
        const node2check = (perp - 1 >= 0) || document.getElementById(getElementWithDir(start - 1, perp - 1, h)).classList.contains('wall');
        const node3check = (perp + 1 < limit) || document.getElementById(getElementWithDir(start - 1, perp + 1, h)).classList.contains('wall');
        check1 = !(node1check && node2check && node3check)
    }
    /* check the end of the wall */
    if (start + len === limit) {check2 = true} else {
        const node1check = !document.getElementById(getElementWithDir(start+len, perp, h)).classList.contains('wall');
        const node2check = (perp - 1 >= 0) || document.getElementById(getElementWithDir(start+len, perp - 1, h)).classList.contains('wall');
        const node3check = (perp + 1 < limit) || document.getElementById(getElementWithDir(start+len, perp + 1, h)).classList.contains('wall');
    check2 = !(node1check && node2check && node3check)
    }
    return (check1 && check2)
}

function getElementWithDir(start, perp, h){
    if (h) {
        return (start).toString() + '-' + (perp).toString()
    } else {
        return (perp).toString() + '-' + (start).toString()
    }
}

async function addWall(start, len, perp, h) {
    let hole = randomPoint(len) + start

    for (let i = start; i < len + start; i++) {
        if (!(i === hole)) {
            const node = document.getElementById(getElementWithDir(i, perp, h));
            if (!node.classList.contains('start') && !node.classList.contains('end')){
                node.classList.add('wall');
                await sleep(100);
            }
        }
    }
}

function randomPoint(len) {
    return Math.floor(Math.random() * len)
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