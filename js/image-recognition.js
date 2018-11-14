function countPixels(img) {
    try {
        var frequency = [new Array(256), new Array(256), new Array(256), new Array(256)];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 256; j++) {
                frequency[i][j] = 0;
            }
        }
        for (var i in img.data) {
            var m = i % 4
            if (m < 3) {
                // Red, Green, Blue.
                frequency[m][img.data[i]] += 1;
            } else {
                // Grayscale.
                var val = Math.round((img.data[i - 1] + img.data[i - 2] + img.data[i - 3]) / 3)
                frequency[m][val] += 1;
            }
        }
        return frequency;
    } catch(err) {
        alert("counting: " + err.message);
    }
}

function equalizeChannel(channel, mult=1, offset=0, exp=1) {
    var sum = 0;
    var accum = new Array(256);
    for (var i = 0; i < 256; i++) {
        accum[i] = 0;
        sum += channel[i];
    }
    var total = 0;
    for (var i = Math.max(0, offset); i < Math.max(256, 256 + offset); i++) {
        total += channel[i - offset];
        var val = Math.pow(total / sum, exp) * mult * 255;
        accum[i] = Math.round(Math.clamp(val, 0, 255));
    }
    for (var i = 256 + offset; i < 256; i++) {
        accum[i] = 255;
    }
    return accum;
}

function equalizePixels(mult=1, offset=0, exp=1) {
    try {
        if (counts) {
            var accum = new Array(4);
            for (var i = 0; i < 4; i++) {
                accum[i] = equalizeChannel(counts[i], mult, offset, exp);
            }
            newimg = ctx.createImageData(image.width, image.height);
            for (var i = 0; i < newimg.data.length; i += 4) {
                newimg.data[i] = accum[0][image.data[i]];
                newimg.data[i + 1] = accum[1][image.data[i + 1]];
                newimg.data[i + 2] = accum[2][image.data[i + 2]];
                newimg.data[i + 3] = image.data[i + 3];
            }
            // image = newimg;
            ctx2.putImageData(newimg, 0, 0);
            return newimg;
        } else {
            alert("Please upload an image or take a picture with camera.")
        }
    } catch(err) {
        alert("equalizing: " + err.message);
    }
}

function resetPixels() {
    if (counts) {
        canvas2.width = image_default.width;
        canvas2.height = image_default.height;
        ctx2.putImageData(image_default, 0, 0);
        image = ctx2.getImageData(0, 0, image_default.width, image_default.height);
        for (var i in onReset) {
            onReset[i]();
        }
    } else {
        alert("Please upload an image or take a picture with camera.")
    }
}

var recognition = (function() {

})();