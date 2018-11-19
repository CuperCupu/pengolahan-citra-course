var sampler = (function() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    /**
     * 
     * @param {Color} c1 Source color.
     * @param {Color} c2 Destination color.
     * @param {Number} t Interpolation factor (0..1).
     * @returns {Color} Color interpolated from the c1 and c2.
     */
    var interpolate = function(c1, c2, t) {
        var delta = new Color(c2.r - c1.r, c2.g - c1.g, c2.b - c1.b, c2.a - c1.a);
        return new Color(c1.r + delta.r * t, c1.g + delta.g * t, c1.b + delta.b * t, c1.a + delta.a * t);
    }
    
    /**
     * @param {ImageData} img 
     * @param {Number} x 0..1 of the image.
     * @param {Number} y 0..1 of the image.
     */
    var sampleBilinear = function(img, x, y) {
        x *= img.width;
        y *= img.height;
        var rx = Math.floor(x);
        var ry = Math.floor(y);
        var fx = x - rx;
        var fy = y - ry;
        var p1 = getImgPixelAt(img, rx, ry);
        var p2 = p1;
        var p3 = p1;
        var p4 = p1;
        if (rx + 1 < img.width) {
            p2 = getImgPixelAt(img, rx + 1, ry);
        }
        if (ry + 1 < img.height) {
            p3 = getImgPixelAt(img, rx, ry + 1);
        }
        if ((rx + 1 < img.width) && (ry + 1 < img.height)) {
            p4 = getImgPixelAt(img, rx + 1, ry + 1);
        }
        // console.log(img.width, img.height, rx, ry, fx, fy);
        var py1 = interpolate(p1, p2, fx);
        var py2 = interpolate(p3, p4, fx);
        var p = interpolate(py1, py2, fy);
        return p;
    }

    var sampleMedian = function(img, x, y) {
        x *= img.width;
        y *= img.height;
        var rx = Math.floor(x);
        var ry = Math.floor(y);
        var fx = x - rx;
        var fy = y - ry;
        var pixels = [getImgPixelAt(img, rx, ry)];
        if ((fx > 0) && (rx + 1 < img.width)) {
            pixels.push(getImgPixelAt(img, rx + 1, ry));
        }
        if ((fy > 0) && (ry + 1 < img.height)) {
            pixels.push(getImgPixelAt(img, rx, ry + 1));
        }
        if ((fx > 0) && (fy > 0) && (rx + 1 < img.width) && (ry + 1 < img.height)) {
            pixels.push(getImgPixelAt(img, rx + 1, ry + 1));
        }
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
        return median;
    }

    /**
     * @param {ImageData} img The image to sample.
     * @param {Number} width Target width of the sampling.
     * @param {Number} height Target height of the sampling.
     * @returns {ImageData} The newly sampled image.
     */
    var resize = function(img, width, height, sampler=sampleBilinear) {
        width = Math.floor(width);
        height = Math.floor(height);
        var newimg = ctx.createImageData(width, height);
        var i = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var res = sampler(img, x / width, y / height);
                newimg.data[i] = res.r;
                newimg.data[i + 1] = res.g;
                newimg.data[i + 2] = res.b;
                newimg.data[i + 3] = res.a;
                i += 4;
            }
        }
        return newimg;
    }

    var sortPixels = function(pixels) {
        pixels.sort((a, b) => {
            return a.getBrightness() - b.getBrightness();
        });
        return pixels;
    }

    return {
        resize: resize,
        interpolate: interpolate,
        sampler: {
            bilinear: sampleBilinear,
            median: sampleMedian
        }
    }
})();