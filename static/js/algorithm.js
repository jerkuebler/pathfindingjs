async function aStar(start, end, gridSize) {
    /* No diagonal moves */
    const neighbors = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    /* Only start node is known at start */
    let openSet = [start];

    /* create a dict that uses node as key and returns previous node as value */
    let cameFrom = {};

    /* gScore[n] represents the currently recognized cheapest path to node n */
    let gScore = {};
    gScore[start] = 0;

    /* for node n, fScore[n] = gScore[n] + heuristic function value of n, using straightLine in this case */
    let fScore = {};
    fScore[start] = straightLine(start, end);

    while (openSet.length > 0) {
        const current = openSet.reduce((a, b) => dictGet(fScore, a, Infinity) < dictGet(fScore, b, Infinity) ? a : b);
        document.getElementById(current).classList.add('visited');
        const currentCoords = current.split("-").map(Number);
        if (current === end) {
            return constructedPath(cameFrom, current, start);
        }
        const index = openSet.indexOf(current);
        if (index > -1) {
            openSet.splice(index, 1);
        }
        neighbors.forEach(function(coords){
            const neighborCoords = [(currentCoords[0] + coords[0]), (currentCoords[1] + coords[1])];
            const gridCheck1 = (neighborCoords[0] > -1 && neighborCoords[0] < gridSize[0]);
            const gridCheck2 = (neighborCoords[1] > -1 && neighborCoords[1] < gridSize[1]);

            if (gridCheck1 && gridCheck2) {
                const neighbor = neighborCoords[0].toString() + '-' + neighborCoords[1].toString();
                const neighborNode = document.getElementById(neighbor);
                const wallCheck = (!neighborNode.classList.contains("wall"));
                if (wallCheck) {
                    neighborNode.classList.add('viewed');
                    const tempGScore = gScore[current] + 1;
                    const neighborGScore = dictGet(gScore, neighbor, Infinity);
                    if (tempGScore < neighborGScore) {
                        cameFrom[neighbor] = current;
                        gScore[neighbor] = tempGScore;
                        fScore[neighbor] = tempGScore + straightLine(neighbor, end);
                        if (!openSet.includes(neighbor)) {
                            openSet.push(neighbor);
                        }
                    }
                }
            }
        });
        await sleep(100);
    }
    /* openSet empty but no goal reached */
    console.log("Failure");

}

async function dijkstra(start, end, gridSize) {
     /* No diagonal moves */
    const neighbors = [[0, -1], [0, 1], [-1, 0], [1, 0]];

    /* Create the set of nodes and dict representing cost to reach each node*/
    let openSet = [];
    let gScore = {};

    for (let i=0; i<gridSize[0];i++){
        for (let j=0; j<gridSize[1]; j++){
            const nodeID = i.toString() + '-' + j.toString();
            openSet.push(nodeID);
            gScore[nodeID] = Infinity;
        }
    }
    /* gScore of starting node is 0 since no distance has been traveled */
    gScore[start] = 0;

    /* create a dict that uses node as key and returns previous node as value */
    let cameFrom = {};

    while (openSet.length > 0) {
        const current = openSet.reduce((a, b) => gScore[a] < gScore[b] ? a : b);
        document.getElementById(current).classList.add('visited');
        const currentCoords = current.split("-").map(Number);
        if (current === end) {
            return constructedPath(cameFrom, current, start);
        }
        const index = openSet.indexOf(current);
        if (index > -1) {
            openSet.splice(index, 1);
        }
        neighbors.forEach(function(coords){
            const neighborCoords = [(currentCoords[0] + coords[0]), (currentCoords[1] + coords[1])];
            const gridCheck1 = (neighborCoords[0] > -1 && neighborCoords[0] < gridSize[0]);
            const gridCheck2 = (neighborCoords[1] > -1 && neighborCoords[1] < gridSize[1]);

            if (gridCheck1 && gridCheck2) {
                const neighbor = neighborCoords[0].toString() + '-' + neighborCoords[1].toString();
                const neighborNode = document.getElementById(neighbor);
                const wallCheck = (!neighborNode.classList.contains("wall"));
                if (wallCheck) {
                    neighborNode.classList.add('viewed');
                    const tempGScore = gScore[current] + 1;
                    const neighborGScore = gScore[neighbor];
                    if (tempGScore < neighborGScore) {
                        cameFrom[neighbor] = current;
                        gScore[neighbor] = tempGScore;
                    }
                }
            }
        });
        await sleep(100);
    }
    /* openSet empty but no goal reached */
    console.log("Failure");
}

async function recursiveDFS (start, end, gridSize) {
    /* No diagonal moves */
    const neighbors = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    /* Create a dict of all nodes so we can mark them as discovered */
    let openSet = {};
    for (let i=0; i<gridSize[0];i++){
        for (let j=0; j<gridSize[1];j++){
            const nodeID = i.toString() + '-' + j.toString();
            openSet[nodeID] = false;
        }
    }

    /* Dict with nodes and their origin so we can reconstruct the path */
    let cameFrom = {};

    /* Set a flag to tell the function to stop running through recursion loops once end is found*/
    let found = false;
    let path;

    /* Run following function until end node found then return path */
    async function recursiveFunc(graph, node) {
        document.getElementById(node).classList.add('visited');
        if (node === end) {
            found = true;
            path = constructedPath(cameFrom, node, start);
        }
        if (found) {
                return path;
            }
        graph[node] = true;
        for (const coords of neighbors) {
            const current = node.split('-').map(Number);
            const neighborCoords = [current[0] + coords[0], current[1] + coords[1]];
            const gridCheck1 =  (neighborCoords[0] > -1 && neighborCoords[0] < gridSize[0]);
            const gridCheck2 = (neighborCoords[1] > -1 && neighborCoords[1] < gridSize[1]);
            if (gridCheck1 && gridCheck2){
                const neighbor = neighborCoords[0].toString() + '-' + neighborCoords[1].toString();
                const neighborNode = document.getElementById(neighbor);
                const wallCheck = !neighborNode.classList.contains('wall');
                const visitedCheck = !openSet[neighbor];
                if (wallCheck && visitedCheck) {
                    await sleep(100);
                    cameFrom[neighbor] = node;
                    neighborNode.classList.add('viewed');
                    return recursiveFunc(graph, neighbor).then(r => {return r});
                }

            }
        }
        if (!found && typeof(cameFrom[node]) === 'string') {
            return recursiveFunc(graph, cameFrom[node]).then(r => {return r});
        } else {
            console.log("Failure");
        }
    }
    return recursiveFunc(openSet, start).then(r => {return r;});
}

function dictGet(obj, key, defaultValue) {
    const result = obj[key];
    return (typeof result !== "undefined") ? result : defaultValue;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function constructedPath(cameFrom, current, origin) {
    let totalPath = [current];
    while (current !== origin) {
        document.getElementById(current).classList.add('path');
        current = cameFrom[current];
        totalPath.unshift(current);
        await sleep(100);
    }
    document.getElementById(origin).classList.add('path');
    return totalPath;
}

function straightLine(start, end) {
    const startNode = start.split("-").map(Number);
    const endNode = end.split("-").map(Number);
    const d1 = Math.abs(endNode[0] - startNode[0]);
    const d2 = Math.abs(endNode[1] - startNode[1]);
    return (d2+d1);
}