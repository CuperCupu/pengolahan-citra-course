function findBound(img) {
    var min = {
        x: img.width,
        y: img.height,
    }
    var max = {
        x: 0,
        y: 0,
    }
    for (var y = 0; y < img.height; y++) {
        for (var x = 0; x < img.width; x++) {
            var p = getImgPixelAt(img, x, y);
            if (p.r > 0) {
                if (x < min.x) {
                    min.x = x;
                }
                if (x > max.x) {
                    max.x = x;
                }
                if (y < min.y) {
                    min.y = y;
                }
                if (y > max.y) {
                    max.y = y;
                }
            }
        }
    }
    let width = max.x - min.x + 1;
    let height = max.y - min.y + 1;
    return {
        min: min,
        max: max,
        width: width,
        height: height,
        diagonal: Math.sqrt(width * width + height * height)
    }
}

function getOffsetFromCenter(x, y, center) {
    off = {
        x: 0,
        y: 0,
    }
    if (x < center.x) {
        off.x = -1;
    } else if (x > center.x) {
        off.x = 1;
    }
    if (y < center.y) {
        off.y = -1;
    } else if (y > center.y) {
        off.y = 1;
    }
    return off;
}

function categorizeQuadrant(off) {
    if ((off.x == 0) && (off.y == 0)) {
        return 0;
    } else if ((off.x == 1) && (off.y == 0)) {
        return 1;
    } else if ((off.x == 1) && (off.y == -1)) {
        return 2;
    } else if ((off.x == 0) && (off.y == -1)) {
        return 3;
    } else if ((off.x == -1) && (off.y == -1)) {
        return 4;
    } else if ((off.x == -1) && (off.y == 0)) {
        return 5;
    } else if ((off.x == -1) && (off.y == 1)) {
        return 6;
    } else if ((off.x == 0) && (off.y == 1)) {
        return 7;
    } else if ((off.x == 1) && (off.y == 1)) {
        return 8;
    }
    return null;
}

function preprocessImage(img) {
    try {
        img = setContrast(img, 255, 1.5);
        img = setBlackWhite(img);
        return img;
    } catch(err) {
        alert("preprocess: " + err.message);
    }
}

// Eight-directional neighbours
var neighbours =  [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]];

// Neighbours Group from Zhang-Suen Rules
var neighboursGroup = [[[0, 2, 4], [2, 4, 6]], [[0, 2, 6], [0, 4, 6]]];

function skeletonizeImage(img) {
    img = preprocessImage(img);
    var firstStep = 0;
    var toBlack = new Array();
    var hasChanged;
    do {    // repeatly checking for reomving side to get the skeleton
        hasChanged = false;
        firstStep = (firstStep + 1) % neighboursGroup.length;
        for (var i = 0; i < img.data.length; i += 4) {
            if (img.data[i] != 255)
                continue;
            var num = nNeighbours(img, i);
            if (num < 2 || num > 6)
                continue;
            if (nTransition(img, i) != 1)
                continue;
            if (!atLeastOneBlack(img, i, firstStep))
                continue;
            toBlack.push(i);
            hasChanged = true;
        }
        for (var i = 0; i < toBlack.length; i++){
            img.data[toBlack[i]] = 0;
            img.data[toBlack[i] + 1] = 0;
            img.data[toBlack[i] + 2] = 0;
        }
        toBlack = new Array();
        
    } while((firstStep || hasChanged));

    return img;
}

function nNeighbours(img, idx) {
    /*
    Find white surroundings on the all eight-directions
    */
    var count = 0;
    var temp;
    
    var tempRow = Math.floor(idx / img.width / 4);
    var tempCol = Math.floor((idx % (img.width * 4) / 4));
    for (var i = 0; i < neighbours.length - 1; i++) {
        temp = ((tempRow + neighbours[i][1]) * img.width * 4)+ ((tempCol + neighbours[i][0]) * 4);
        if (img.data[temp] == 255){
            count++;
        }
    }
    return count;
}

function nTransition(img, idx) {
    /*
    Find total transition from 0 (black) to 255 (white) from the surroundings
    */
    var count = 0;
    var temp1, temp2;
    
    var tempRow = Math.floor(idx / img.width / 4);
    var tempCol = Math.floor((idx % (img.width * 4) / 4));
    for (var i = 0; i < neighbours.length - 1; i++) {
        temp1 = ((tempRow + neighbours[i][1]) * img.width * 4) + ((tempCol + neighbours[i][0]) * 4);
        temp2 = ((tempRow + neighbours[i + 1][1]) * img.width * 4) + ((tempCol + neighbours[i + 1][0]) * 4);
        if (img.data[temp1] === 0)
            if (img.data[temp2] === 255)
                count++;
    }
    temp1 = ((tempRow + neighbours[neighbours.length - 1][1]) * img.width * 4) + ((tempCol + neighbours[neighbours.length - 1][0]) * 4);
    temp2 = ((tempRow + neighbours[0][1]) * img.width * 4) + ((tempCol + neighbours[0][0]) * 4);
    if (img.data[temp1] === 0)
        if (img.data[temp2] === 255)
            count++;
    return count;
}

function atLeastOneBlack(img, idx, step) {
    /*
    Find at least one black from the surrounding according to the neighbours groups
    */
    var count = 0;
    var temp;
    var group = neighboursGroup[step];
    var tempRow = Math.floor(idx / img.width / 4);
    var tempCol = Math.floor((idx % (img.width * 4) / 4));

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < group[i].length; j++) {
            var surround = neighbours[group[i][j]];
            temp = ((tempRow + surround[1]) * img.width * 4) + ((tempCol + surround[0]) * 4);
            if (img.data[temp] === 0) {
                count++;
                break;
            }
        }
    }
    return count > 1;
}

var boldNeighbours = [[[1,1],[1,0]],[[1,1],[0,1]],[[-1,1],[-1,0]],[[-1,1],[0,1]],[[-1,-1],[-1,0]],[[-1,-1],[0,-1]],[[1,-1],[1,0]],[[1,-1],[0,-1]]]
// var endPoints = []
// var crucialPoints = []
function delBoldNeighbours(img, idx, crucialPoints){
    var triplePoint = true
    var tempRow = Math.floor(idx / img.width / 4);
    var tempCol = Math.floor((idx % (img.width * 4) / 4));
    for (i = 0; i < boldNeighbours.length; i++){
        temp1 = ((tempRow + boldNeighbours[i][0][1]) * img.width * 4)+ ((tempCol + boldNeighbours[i][0][0]) * 4)
        temp2 = ((tempRow + boldNeighbours[i][1][1]) * img.width * 4)+ ((tempCol + boldNeighbours[i][1][0]) * 4)
        if (img.data[temp1] == 255 && img.data[temp2] == 255 && !(crucialPoints.includes(temp2))){
            img.data[temp2] = 0
            img.data[temp2 + 1] = 0
            img.data[temp2 + 2] = 0
        }
    }
}
function findCrucialPoints (img){
    var crucialPoints = []
    for (var i = 0; i < img.data.length; i += 4){
        if (nTransition(img, i) > 2 && img.data[i] == 255){
            crucialPoints.push(i)
        }
    }
    return crucialPoints
}

function findEndPoints(img) {
    var endPoints = []
    for (var i = 0; i < img.data.length; i += 4) {
        if (img.data[i] == 255){
            var num = nNeighbours(img, i)
            if (num == 1) {         // Found end points
                endPoints.push({
                    x: Math.floor((i % (img.width * 4) / 4)),
                    y: Math.floor(i / img.width / 4)
                })
            }
        }
    }
    return endPoints;
}

function findDots(img) {
    var dots = []
    for (var i = 0; i < img.data.length; i += 4) {
        if (img.data[i] == 255){
            var num = nNeighbours(img, i)
            if (num == 0) {
                dots.push({
                    x: Math.floor((i % (img.width * 4) / 4)),
                    y: Math.floor(i / img.width / 4)
                })
            }
        }
    }
    return dots;
}

function findEndPointsRaw(img) {
    var endPoints = []
    for (var i = 0; i < img.data.length; i += 4) {
        if (img.data[i] == 255){
            var num = nNeighbours(img, i)
            if (num == 1) {         // Found end points
                endPoints.push(i);
            }
        }
    }
    return endPoints;
}

function findTriplePoints (img){
    var triplePoints = []
    for (var i = 0; i < img.data.length; i += 4){
        if (nTransition(img, i) == 3 && img.data[i] == 255 && nNeighbours(img, i) == 3){
            triplePoints.push(i)
        }
    }
    return triplePoints
}

neighbourOfTwo = [  [-2, 1], [-2, 0], [-2, -1], [-2, -2],
                    [-1, -2], [0, -2], [1, -2], [2, -2],
                    [2, -1], [2, 0], [2, 1], [2, 2],
                    [1, 2], [0, 2], [-1, 2], [-2, 2]  ]

function determineTreshold (img, endPoints, triplePoints, crucialPoints){

}

function findTurningPoints (img){
    var turningPoint = []
    for (var i = 0; i < img.data.length; i+= 4){
        var temp = []
        var tempRow = Math.floor(i / img.width / 4);
        var tempCol = Math.floor((i % (img.width * 4) / 4));
        if (img.data[i] == 255){
            for (var j = 0; j < neighbours.length - 1; j++){
                temp.push(((tempRow + neighbours[j][0]) * img.width * 4) + ((tempCol + neighbours[j][1]) * 4));
            }
            for (var j = 0; j < temp.length; j++){
                if ((img.data[temp[j]] == 255) && (img.data[temp[(j+1) % (neighbours.length - 1)]] == 255 || img.data[temp[(j+2) % (neighbours.length - 1)]] == 255)){ //|| img.data[temp[(j+3) % neighbourOfTwo.length]] == 255)){
                    turningPoint.push(i)
                }
            }
        }
    }
    return turningPoint
}

function postprocessImage(img){
    var endPoints = [];
    var crucialPoints = findCrucialPoints(img);
    // console.log(triplePoints)
    for (var i = 0; i < img.data.length; i += 4) {
        if (img.data[i] == 255){
            var num = nNeighbours(img, i);
            if (num == 1) {         // Found end points
                endPoints.push(i);
            }
            else if (num == 2){     // Ordinary connected pixel
                // do nothing
            }
            else{     // Found multiple points
                delBoldNeighbours(img, i, crucialPoints);
            }
        }
    }
    // var triplePoints = findTriplePoints(img);
    
    // img = removeFakeLines(img, endPoints, triplePoints, crucialPoints);
    // turningPoints = findTurningPoints(img);
    //console.log(turningPoints)
    // for (var i = 0; i < turningPoints.length; i++){
    //     img.data[turningPoints[i]] = 250;
    //     img.data[turningPoints[i] + 1] = 0;
    //     img.data[turningPoints[i] + 2] = 0;
    // }
    return img
}
function diagonalLength(A, B, img){
    xA = Math.floor((A % (img.width * 4) / 4));
    yA = Math.floor(A / img.width / 4);
    xB = Math.floor((B % (img.width * 4) / 4));
    yB = Math.floor(B / img.width / 4);

    return Math.sqrt(((xA - xB) * (xA - xB)) + ((yA - yB) * (yA - yB)))
}

function removeFakeLines(img, endPoints, triplePoints, crucialPoints){
    var suspectValue = [];
    for (var i = 0; i < triplePoints.length; i++){
        var len = diagonalLength(triplePoints[i], endPoints[0], img)
        suspectValueN = endPoints[0];
        for (var j = 0; j < endPoints.length; j++){
            if (diagonalLength(triplePoints[i], endPoints[j], img) < len){
                len = diagonalLength(triplePoints[i], endPoints[j], img)
                suspectValueN = endPoints[j]
            }
        }
        suspectValue.push(suspectValueN)
    }

    for (var i = 0; i < triplePoints.length; i++){
        idx = 0
        var tempPointer = []
        pointer = triplePoints[i]
        if (endPoints.length != 0){
            while (pointer != suspectValue[i] && !crucialPoints.includes(suspectValue[i])){
                tempPoint = []
                change = false
                var tempRow = Math.floor(pointer / img.width / 4);
                var tempCol = Math.floor((pointer % (img.width * 4) / 4));
                for (var j = 0; j < neighbours.length; j++) {
                    temp = ((tempRow + neighbours[j][1]) * img.width * 4)+ ((tempCol + neighbours[j][0]) * 4);
                    if (img.data[temp] == 255){
                        tempPoint.push(temp)
                    }   
                }
                len = diagonalLength(pointer, suspectValue[i], img)
                for (var j = 0; j < tempPoint.length; j++){
                    if (diagonalLength(tempPoint[j], suspectValue[i], img) < len){// && nNeighbours(img, temp[j+1]) == 2){
                        len = diagonalLength(tempPoint[j], suspectValue[i], img);
                        pointer = tempPoint[j];
                        change = true
                        tempPointer.push(pointer)
                    }
                }
                if (change){
                    var index = crucialPoints.indexOf(pointer);
                    if (index > -1) {
                        crucialPoints.splice(index, 1);
                    }
                    index = endPoints.indexOf(pointer);
                    if (index > -1) {
                        endPoints.splice(index, 1);
                    }
                    img.data[pointer] = 0;
                    img.data[pointer + 1] = 0;
                    img.data[pointer + 2] = 0;
                }
                else{
                    for (var j = 0; j < tempPointer.length; j++){
                        img.data[tempPointer[j]] = 255;
                        img.data[tempPointer[j] + 1] = 255;
                        img.data[tempPointer[j] + 2] = 255;
                    }
                    break;
                }
            }
        }
    }
    return img
}

neighboursStraight = [[[1, -1], [1, 0], [1, 1]], [[1, 1], [0, 1], [-1, 1]], [[-1, 1], [-1, 0], [-1, -1]], [[-1, -1], [0, -1], [1, -1]], [[0, 1], [1, 1], [1, 0]], [[1, 0], [1, -1], [0, -1]], [[0, -1], [-1, -1], [-1, 0]], [[-1, 0], [-1, 1], [0, 1]]]

// function checkTripleStraight(img, idx, turningPoints, endPoints, triplePoints) {
//     let everyPoints = []
//     var tempRow = Math.floor(idx / img.width / 4);
//     var tempCol = Math.floor((idx % (img.width * 4) / 4));
//     for (var i = 0; i < neighboursStraight.length; i++){
//         straight = true;
//         state = i;
//         for (var j = 0; j < neighboursStraight[i].length; j++){
//             temp = ((tempRow + neighboursStraight[i][j][1]) * img.width * 4)+ ((tempCol + neighboursStraight[i][j][0]) * 4);
//             if (img.data[temp] == 255){
//                 straight = false;
//                 break;
//             }
//         }
//         if (straight)
//             break;
//     }
//     everyPoints.concat(turningPoints);
//     everyPoints.concat(endPoints);
//     everyPoints.concat(triplePoints);
//     tempLength = diagonalLength(idx, everyPoints[0], img);
//     suspect = 0;
//     for (let i = 1; i < everyPoints.length; i++){
//         if (tempLength > diagonalLength(idx, everyPoints[i], img), i++){
//             tempLength = diagonalLength(idx, everyPoints[i], img);
//             suspect = i;
//         }
//     }
//     dir.push(neighboursStraight[state][0]);
//     dir.push(neighboursStraight[state][1]);

//     cond1 = 

//     if (

//     if (dir1 )

//     return straight;
// }

function removeSuspectOneDot(img, endPoints){
    var detected = false;
    minDistace = 9999;
    var tempPointer = [];
    for (let i = 0; i < endPoints.length-1; i++){
        for (let j = i+1; j < endPoints.length; j++){
            if (diagonalLength(endPoints[i], endPoints[j], img) < minDistace){
                minDistace = diagonalLength(endPoints[i], endPoints[j], img);
                point1 = endPoints[i];
                point2 = endPoints[j];
                detected = true;
            }
        }
    }
<<<<<<< Updated upstream
    if (!detected) {
        return img;
    }
    trace = findBoundary(img).trace;
    bound = findBound(img);
    xBoundLength = bound.width;
    yBoundLength = bound.height;
    //n = realDistanceBetween(point1, point2, trace);
    n = diagonalLength(point1, point2, img);
    console.log(n, (Math.sqrt(Math.pow(xBoundLength, 2) + Math.pow(yBoundLength, 2)) * 0.15));
    console.log(point1, point2);
    if (n < (Math.sqrt(Math.pow(xBoundLength, 2) + Math.pow(yBoundLength, 2)) * 0.15)){
        console.log("Inside n")
        pointer = point1;
        while (pointer != point2){
            tempPoint = []
            change = false
            var tempRow = Math.floor(pointer / img.width / 4);
            var tempCol = Math.floor((pointer % (img.width * 4) / 4));
            for (let i = 0; i < neighbours.length - 1; i++){
                temp = ((tempRow + neighbours[i][1]) * img.width * 4)+ ((tempCol + neighbours[i][0]) * 4);
                if (img.data[temp] == 255){
                    tempPoint.push(temp);
                }   
            }
            len = diagonalLength(pointer, point2, img);
            for (let j = 0; j < tempPoint.length; j++){
                if (diagonalLength(tempPoint[j], point2, img) < len){// && nNeighbours(img, temp[j+1]) == 2){
                    len = diagonalLength(tempPoint[j], point2, img);
                    pointer = tempPoint[j];
                    change = true;
                    tempPointer.push(pointer);
=======
    if (detected){
        trace = findBoundary(img).trace;
        bound = findBound(img);
        xBoundLength = bound.width;
        yBoundLength = bound.height;
        //n = realDistanceBetween(point1, point2, trace);
        n = diagonalLength(point1, point2, img);
        console.log(n, (Math.sqrt(Math.pow(xBoundLength, 2) + Math.pow(yBoundLength, 2)) * 0.15));
        console.log(point1, point2);
        if (n < (Math.sqrt(Math.pow(xBoundLength, 2) + Math.pow(yBoundLength, 2)) * 0.15)){
            console.log("Inside n")
            pointer = point1;
            while (pointer != point2){
                tempPoint = []
                change = false
                var tempRow = Math.floor(pointer / img.width / 4);
                var tempCol = Math.floor((pointer % (img.width * 4) / 4));
                for (let i = 0; i < neighbours.length - 1; i++){
                    temp = ((tempRow + neighbours[i][1]) * img.width * 4)+ ((tempCol + neighbours[i][0]) * 4);
                    if (img.data[temp] == 255){
                        tempPoint.push(temp);
                    }   
>>>>>>> Stashed changes
                }
                len = diagonalLength(pointer, point2, img);
                for (let j = 0; j < tempPoint.length; j++){
                    if (diagonalLength(tempPoint[j], point2, img) < len){// && nNeighbours(img, temp[j+1]) == 2){
                        len = diagonalLength(tempPoint[j], point2, img);
                        pointer = tempPoint[j];
                        change = true;
                        tempPointer.push(pointer);
                    }
                }
                if (change){
                    // var index = crucialPoints.indexOf(pointer);
                    // if (index > -1) {
                    //     crucialPoints.splice(index, 1);
                    // }
                    // index = endPoints.indexOf(pointer);
                    // if (index > -1) {
                    //     endPoints.splice(index, 1);
                    // }
                    img.data[pointer] = 0;
                    img.data[pointer + 1] = 0;
                    img.data[pointer + 2] = 0;
                }
                else{
                    for (var j = 0; j < tempPointer.length; j++){
                        img.data[tempPointer[j]] = 255;
                        img.data[tempPointer[j] + 1] = 255;
                        img.data[tempPointer[j] + 2] = 255;
                    }
                    break;
                }
            }
        }
    }
    return img;
}

function getOnePoints(img){
    var onePoints = []
    for (var i = 0; i < img.data.length; i += 4){
        if (nNeighbours(img, i) == 0 && img.data[i] == 255){
            onePoints.push(i)
        }
    }
    console.log(onePoints);
    return onePoints;
}

function removeFakeLinesThreshold(img, endPoints, triplePoints, crucialPoints){
    let bound = findBound(img);
    xBoundLength = bound.max.x - bound.min.x;
    yBoundLength = bound.max.y - bound.min.y;
    rBoundLength = Math.sqrt(Math.pow(xBoundLength, 2) + Math.pow(yBoundLength, 2));
    // heuristicLength = Math.sqrt(Math.pow((findBound(img).max.y - findBound(img).min.y),2) + Math.pow((findBound(img).max.x - findBound(img).min.x),2))
    
    thresholdChoice = rBoundLength * 0.2
    nPercent = 0.17;//Math.abs(xBoundLength - yBoundLength) / (xBoundLength + yBoundLength) * 1.25
    var suspectValue = []
    for (var i = 0; i < triplePoints.length; i++){
        let suspectValueN = []
        // let len = diagonalLength(triplePoints[i], endPoints[0], img)
        // suspectValueN = endPoints[0];
        for (var j = 0; j < endPoints.length; j++){
            len = diagonalLength(triplePoints[i], endPoints[j], img)
            if (len <= thresholdChoice){
                suspectValueN.push(endPoints[j])
            }
        }
        suspectValue.push(suspectValueN)
    }
    
    for (var i = 0; i < triplePoints.length; i++){
        for (let k = 0; k < suspectValue.length; k++){
            var tempPointer = []
            pointer = triplePoints[i]
            sine = Math.abs(Math.floor((pointer % (img.width * 4) / 4) - Math.floor((suspectValue[i][k] % (img.width * 4) / 4)))) / diagonalLength(pointer, suspectValue[i][k], img);
            if (sine <= 0.5) {
                threshold = nPercent * yBoundLength;
            }
            else if (sine > 0.866) {
                threshold = nPercent * xBoundLength;
            }
            else {
                threshold = nPercent * rBoundLength;
            }
            if (endPoints.length != 0 && (diagonalLength(triplePoints[i], suspectValue[i][k], img) <= threshold)){//&& !checkTripleStraight(img, triplePoints[i])){
                while (pointer != suspectValue[i][k] && !crucialPoints.includes(suspectValue[i][k])){
                    tempPoint = []
                    change = false
                    var tempRow = Math.floor(pointer / img.width / 4);
                    var tempCol = Math.floor((pointer % (img.width * 4) / 4));
                    for (var j = 0; j < neighbours.length; j++) {
                        temp = ((tempRow + neighbours[j][1]) * img.width * 4)+ ((tempCol + neighbours[j][0]) * 4);
                        if (img.data[temp] == 255){
                            tempPoint.push(temp)
                        }   
                    }
                    len = diagonalLength(pointer, suspectValue[i][k], img)
                    for (var j = 0; j < tempPoint.length; j++){
                        if (diagonalLength(tempPoint[j], suspectValue[i][k], img) < len){// && nNeighbours(img, temp[j+1]) == 2){
                            len = diagonalLength(tempPoint[j], suspectValue[i][k], img);
                            pointer = tempPoint[j];
                            change = true
                            tempPointer.push(pointer)
                        }
                    }
                    if (change){
                        var index = crucialPoints.indexOf(pointer);
                        if (index > -1) {
                            crucialPoints.splice(index, 1);
                        }
                        index = endPoints.indexOf(pointer);
                        if (index > -1) {
                            endPoints.splice(index, 1);
                        }
                        img.data[pointer] = 0;
                        img.data[pointer + 1] = 0;
                        img.data[pointer + 2] = 0;
                    }
                    else{
                        for (var j = 0; j < tempPointer.length; j++){
                            img.data[tempPointer[j]] = 255;
                            img.data[tempPointer[j] + 1] = 255;
                            img.data[tempPointer[j] + 2] = 255;
                        }
                        break;
                    }
                }
            }
        }
    }
    return img
}