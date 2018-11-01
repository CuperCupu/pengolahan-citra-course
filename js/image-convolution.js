function getNeighbouringPixelsAt(img, x, y) {
    var neighbours = [];
    if ((x > 0) && (y > 0)) {
        neighbours.push(getImgPixelAt(img, x - 1, y - 1));
    }
    if ((x < img.width - 1) && (y > 0)) {
        neighbours.push(getImgPixelAt(img, x + 1, y - 1));
    }
    if ((x < img.width - 1) && (y < img.height - 1)) {
        neighbours.push(getImgPixelAt(img, x + 1, y + 1));
    }
    if ((x > 0) && (y < img.height - 1)) {
        neighbours.push(getImgPixelAt(img, x - 1, y + 1));
    }
    if (x > 0) {
        neighbours.push(getImgPixelAt(img, x - 1, y));
    }
    if (x < img.width - 1) {
        neighbours.push(getImgPixelAt(img, x + 1, y));
    }
    if (y > 0) {
        neighbours.push(getImgPixelAt(img, x, y - 1));
    }
    if (y < img.height - 1) {
        neighbours.push(getImgPixelAt(img, x, y + 1));
    }
    return neighbours;
}

function sortPixels(pixels) {
    
    pixels.sort((a, b) => {
        var ga = (a.r + a.g + a.b) / 3;
        var gb = (b.r + b.g + b.b) / 3;
        return ga - gb;
    });
    return pixels;
}

function medianFilter(img) {
    var newimg = ctx2.getImageData(0, 0, img.width, img.height);
    for (var y = 0; y < newimg.height; y++) {
        for (var x = 0; x < newimg.width; x++) {
            var n = getNeighbouringPixelsAt(img, x, y);
            var pixels = sortPixels(n);
            var median;
            if (pixels.length % 2 == 0) {
                var idx1 = pixels.length / 2;
                var idx2 = idx1 - 1;
                median = new Color(
                    (pixels[idx1].r + pixels[idx2].r) / 2,
                    (pixels[idx1].g + pixels[idx2].g) / 2,
                    (pixels[idx1].b + pixels[idx2].b) / 2,
                    (pixels[idx1].a + pixels[idx2].a) / 2
                );
            } else {
                var idx = Math.floor(pixels.length / 2);
                median = pixels[idx];
            }
            setImgPixelAt(newimg, x, y, median);
        }
    }
    return newimg;
}

function pixelMirror(img, x, y) {
    if (x < 0) {
        x = -x;
    }
    if (x >= img.width) {
        x = 2 * img.width - x;
    }
    if (y < 0) {
        y = -y;
    }
    if (y >= img.height) {
        y = 2 * img.height - y;
    }
    return {
        x: x,
        y: y
    }
}

function getPixelsSquare(img, x, y) { // Returns a 9 length.
    var neighbours = [];
    var off = [];
    for (var dy = y - 1; dy <= y + 1; dy++) {
        for (var dx = x - 1; dx <= x + 1; dx++) {
            off.push(pixelMirror(dx, dy));
        }
    }
    for (var i in off) {
        neighbours.push(getImgPixelAt(img, off[x].x, off[i].y));
    }
    return neighbours;
}

function multKernel(neighbours, kernel) {
    var result = new Color(0, 0, 0, 255);
    for (i = 0; i < kernel.length; i++) {
        result.r += neighbours[i].r * kernel[kernel.length - 1 - i];
        result.g += neighbours[i].g * kernel[kernel.length - 1 - i];
        result.b += neighbours[i].b * kernel[kernel.length - 1 - i];
    }
    return result;
}