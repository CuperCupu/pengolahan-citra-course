// Based on Fleck and Forsyth Algorithm

function LogOpponentFunction(x){
    return 105 * (Math.log(x+1) / Math.log(10));
}

function convertToLogOpponent(img){
    var irgby = {
        "i": [],
        "rg": [],
        "by": []
    }
    // Iterate through all pixel
    for(let i = 0; i < img.data.length; i += 4){
        let r = img.data[i];
        let g = img.data[i+1];
        let b = img.data[i+2];
        let int = (LogOpponentFunction(r) + LogOpponentFunction(g) + LogOpponentFunction(b)) / 3;
        irgby.i.push((LogOpponentFunction(r) + LogOpponentFunction(g) + LogOpponentFunction(b)) / 3);
        irgby.rg.push(LogOpponentFunction(r) - LogOpponentFunction(g));
        irgby.by.push(LogOpponentFunction(b) - (LogOpponentFunction(g) + LogOpponentFunction(r)) / 2);
        // irgby.rg.push(LogOpponentFunction(r) - int);
        // irgby.by.push(LogOpponentFunction(b) - (int + LogOpponentFunction(r)) / 2);
    }
    return irgby;
}

function radiansToDegrees(radians){
    return radians * 180.0 / Math.PI;
}

function hue(i, irgby){
    let rg = irgby.rg[i];
    let by = irgby.by[i];
    return radiansToDegrees(Math.atan2(rg, by));
}

function saturation(i, irgby){
    let rg = irgby.rg[i];
    let by = irgby.by[i];
    return Math.sqrt(Math.pow(rg, 2) + Math.pow(by, 2));
}

function createHue(irgby){
    var hueBuffer = [];

    for(let i = 0; i < irgby.i.length; i++){
        hueBuffer.push(hue(i, irgby));
    }
    return hueBuffer;
}

function createSaturation(irgby){
    var saturationBuffer = [];

    for(let i = 0; i < irgby.i.length; i++){
        saturationBuffer.push(saturation(i, irgby));
    }
    return saturationBuffer;
}

function isBetween(value, lower, upper){
    return (value >= lower) && (value <= upper);
}

function detectSkin(img){
    function skinMap(intensity, hue, saturation){
        return (
            ((isBetween(hue, 120, 160) && isBetween(saturation, 10, 60))
            || (isBetween(hue, 150, 180) && isBetween(saturation, 20, 80)))
        );
        // return isBetween(hue, 110, 170) && isBetween(saturation, 0, 130);
    }
    var skin = [];

    irgby = convertToLogOpponent(img);
    hueBuffer = createHue(irgby);
    saturationBuffer = createSaturation(irgby);

    for(let i = 0; i < irgby.i.length; i++){
        if (skinMap(irgby.i[i], hueBuffer[i], saturationBuffer[i])){
            // img.data[i*4] = img.data[i*4 + 1] = img.data[i*4 + 2] = 255;
            skin.push(1);
        }
        else{
            // img.data[i*4] = img.data[i*4 + 1] = img.data[i*4 + 2] = 0;
            skin.push(0);
        }
    }
    return skin;
}

var skinmap = (function() {
    /**
     * Create a skinmap via YCbCr
     * @param {ImageData} img 
     */
    var YCbCr = function(img) {
        var map = new density.DensityMap(img.width, img.height);
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                var p = getImgPixelAt(img, x, y).toYCrCb();
                if ((p.r > 80) && (p.g > 85) && (p.g < 135) && (p.b > 135) && (p.b < 180)) {
                    map.setAt(x, y, 1);
                } else {
                    map.setAt(x, y, 0);
                }
            }
        }
        return map;
    }

    return {
        YCbCr: YCbCr
    }
})();
