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

