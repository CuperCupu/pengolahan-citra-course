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
        return a.getBrightness() - b.getBrightness();
    });
    return pixels;
}

function medianFilter(img) {
    var newimg = ctx2.createImageData(img.width, img.height);
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
        x = 2 * img.width - x - 1;
    }
    if (y < 0) {
        y = -y;
    }
    if (y >= img.height) {
        y = 2 * img.height - y - 1;
    }
    return {
        x: x,
        y: y
    }
}

function getPixelsSquare(img, x, y, greyscale=false, size=3, offset=-1, wrapFunc=pixelMirror) { // Returns a 9 length.
    var neighbours = [];
    var off = [];
    for (var dy = y + offset; dy < y + offset + size; dy++) {
        for (var dx = x + offset; dx < x + offset + size; dx++) {
            off.push(wrapFunc(img, dx, dy));
        }
    }
    if (greyscale) {
        for (var i in off) {
            var brightness = getImgPixelAt(img, off[i].x, off[i].y).getBrightness();
            neighbours.push(new Color(brightness, brightness, brightness, 255));
        }
    } else {
        for (var i in off) {
            neighbours.push(getImgPixelAt(img, off[i].x, off[i].y));
        }
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

function operator(img, operator, size=3, offset=-1, greyscale=false) {
    var t = [];
    for (var i = 0; i < size; i++) {
        for (var j = size - 1; j >= 0; j--) {
            t.push(operator[(i + j * size)]);
        }
    }
    return operateKernel(img, [operator, t], size, offset, greyscale);
}

function operateKernel(img, kernels, size=3, offset=-1, greyscale=false) {
    var newimg = ctx2.createImageData(img.width, img.height);
    for (var y = 0; y < newimg.height; y++) {
        for (var x = 0; x < newimg.width; x++) {
            var n = getPixelsSquare(img, x, y, greyscale, size, offset);
            var b = 0
            for (var i in kernels) {
                var t = multKernel(n, kernels[i]);
                b += Math.pow(t.getBrightness(), 2);
            }
            b = Math.sqrt(b);
            setImgPixelAt(newimg, x, y, new Color(b, b, b, 255));
        }
    }
    return newimg;
}

function differenceOperator(img) {
    var newimg = ctx2.createImageData(img.width, img.height);
    for (var y = 0; y < newimg.height; y++) {
        for (var x = 0; x < newimg.width; x++) {
            var c = getImgPixelAt(img, x, y).getBrightness();
            var n = getPixelsSquare(img, x, y);
            var idx = 0;
            var max = Math.abs(n[idx].getBrightness() - c);
            for (var i = 1; i < n.length; i++) {
                var d = Math.abs(n[i].getBrightness() - c);
                if (d > max) {
                    idx = i;
                    max = d;
                }
            }
            // setImgPixelAt(newimg, x, y, n[idx]);
            setImgPixelAt(newimg, x, y, new Color(max, max, max, 255));
            // console.log(n.length, idx, n[idx].g, n[idx].g, n[idx].b, n[idx].getBrightness());
        }
    }
    return newimg;
}

function gradienceOperator(img) {
    var newimg = ctx2.createImageData(img.width, img.height);
    for (var y = 0; y < newimg.height; y++) {
        for (var x = 0; x < newimg.width; x++) {
            var n = getPixelsSquare(img, x, y);
            var grad = [];
            var count = Math.floor(n.length / 2);
            for (var i = 0; i < count; i++) {
                grad.push(Math.abs(n[i].getBrightness() - n[i + count + 1].getBrightness()));
            }
            var idx = 0;
            var max = grad[idx];
            for (var i = 1; i < grad.length; i++) {
                if (grad[i] > max) {
                    idx = i;
                    max = grad[i];
                }
            }
            // setImgPixelAt(newimg, x, y, n[idx]);
            setImgPixelAt(newimg, x, y, new Color(max, max, max, 255));
            // console.log(n.length, idx, n[idx].g, n[idx].g, n[idx].b, n[idx].getBrightness());
        }
    }
    return newimg;
}