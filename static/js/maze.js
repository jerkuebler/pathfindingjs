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