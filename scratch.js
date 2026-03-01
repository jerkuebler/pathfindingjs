async function divide(x, y, width, height, wide) {
        if (width < 2 || height < 2){return}
        let [start, start_len, perp, perp_len] = wide ? [x, width, y, height] : [y, height, x, width]

        let n_perp
        let perp_array = getPossiblePos(perp, perp_len)
        while (perp_array.length > 0){
            perp_idx = randomPoint(perp_array.length)
            n_perp = perp_array[perp_idx]
            if (checkHole(start, start_len, n_perp, wide, gridSize)){
                addWall(start, start_len, n_perp, wide);
                break
            } else {
                perp_array.splice(perp_idx)
            }
        }

        if (perp_array.length > 0) {
            await sleep(500);
            let new_len = n_perp - perp
            let [nx, ny, nw, nh] = wide ? [x, y, width, new_len] : [x, y, new_len, height]
            divide(nx, ny, nw, nh, chooseOrientation(nw, nh));

            new_len = perp + perp_len - n_perp - 1;
            [nx, ny, nw, nh] = wide ? [x, n_perp + 1, width, new_len] : [n_perp + 1, y, new_len, height]
            divide(nx, ny, nw, nh, chooseOrientation(nw, nh));
            }             
        
    }

async function divide(x, y, width, height, wide) {
        if (width < 2 || height < 2){return}
        if (wide) {

            let ny
            let y_array = getPossiblePos(y, height)
            while (y_array.length > 0){
                ny_idx = randomPoint(y_array.length)
                ny = y_array[ny_idx]
                if (checkHole(x, width, ny, wide, gridSize)){
                    addWall(x, width, ny, wide);
                    break
                } else {
                    y_array.splice(ny_idx)
                }
            }

            if (y_array.length > 0) {
                await sleep(500);
                let h = ny - y
                divide(x, y, width, h, chooseOrientation(h, width));

                h = y + height - ny - 1
                divide(x, ny + 1, width, h, chooseOrientation(h, width));
            }             
        } else {

            let nx
            let x_array = getPossiblePos(x, width)

            while (x_array.length > 0){
                nx_idx = randomPoint(x_array.length)
                nx = x_array[nx_idx]
                if (checkHole(y, height, nx, wide, gridSize)){
                    addWall(y, height, nx, wide);
                    break
                } else {
                    x_array.splice(nx_idx, 1)
                }
            }
            if (x_array.length > 0) {
                await sleep(500);

                let w = nx - x
                divide(x, y, w, height, chooseOrientation(height, w));

                w = x + width - nx - 1
                divide(nx + 1, y, w, height, chooseOrientation(height, w));
            }            
        }
    }

async function divide(column, row, height, width, tall) {
    if (height < 2 || width < 2){return}
    let [start, start_len, perp, perp_len] = tall ? [column, height, row, width] : [row, width, column, height]

    let n_perp
    let perp_array = getPossiblePos(perp, perp_len)
    while (perp_array.length > 0){
        perp_idx = randomPoint(perp_array.length)
        n_perp = perp_array[perp_idx]
        if (checkHole(start, start_len, n_perp, tall, gridSize)){
            addWall(start, start_len, n_perp, tall);
            break
        } else {
            perp_array.splice(perp_idx, 1)
        }
    }

    if (perp_array.length > 0) {
        await sleep(500);
        let new_len = n_perp - perp
        let [ncolumn, nrow, nh, nw] = tall ? [column, row, height, new_len] : [column, row, new_len, width]
        divide(ncolumn, nrow, nh, nw, chooseOrientation(nh, nw));

        new_len = perp + perp_len - n_perp - 1;
        [ncolumn, nrow, nh, nw] = tall ? [column, n_perp + 1, height, new_len] : [n_perp + 1, row, new_len, width]
        divide(ncolumn, nrow, nh, nw, chooseOrientation(nh, nw));
        } else {
            console.log(`Failed to draw line, column=${column}, row=${row}, height=${height}, width=${width}, tall=${tall}`)
        }             
    
}

async function divide(x, y, width, height, tall) {
        if (width < 2 || height < 2){return}
        let [start, start_len, perp, perp_len] = tall ? [x, width, y, height] : [y, height, x, width]

        let n_perp
        let perp_array = getPossiblePos(perp, perp_len)
        while (perp_array.length > 0){
            perp_idx = randomPoint(perp_array.length)
            n_perp = perp_array[perp_idx]
            if (checkHole(start, start_len, n_perp, tall, gridSize)){
                addWall(start, start_len, n_perp, tall);
                break
            } else {
                perp_array.splice(perp_idx, 1)
            } 
        }

        if (perp_array.length > 0) {
            await sleep(500);
            let new_len = n_perp - perp
            let [nx, ny, nw, nh] = tall ? [x, y, width, new_len] : [x, y, new_len, height]
            divide(nx, ny, nw, nh, chooseOrientation(nh, nw));

            new_len = perp + perp_len - n_perp - 1;
            [nx, ny, nw, nh] = tall ? [x, n_perp + 1, width, new_len] : [n_perp + 1, y, new_len, height]
            divide(nx, ny, nw, nh, chooseOrientation(nh, nw));
            }  else {
            console.log(`Failed to draw line, x=${x}, y=${y}, height=${height}, width=${width}, tall=${tall}`)
        }            
        
    }