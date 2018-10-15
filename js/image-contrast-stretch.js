

function setContrast(distance, exp=1) {
    try {
        if (counts) {
            var sum = 0;
            var total = 0;
            for (var i = 0; i < 256; i++) {
                sum += counts[3][i];
                total += i * counts[3][i];
            }
            var center = Math.round(total / sum);
            contrastStretch(0, 255, center - distance / 2, center + distance / 2, exp);
        }
    } catch(err) {
        alert("contrast stretch: " + err.message);
    }
}

function contrastStretch(min, max, min2, max2, exp=1) {
    try {
        if (counts) {
            var range = max - min;
            var range2 = max2 - min2;
            var ALU = new Array(4);
            for (var j = 0; j < 4; j++) {
                ALU[j] = new Array(256);
                for (var i = 0; i < 256; i++) {
                    ALU[j][i] = Math.round(Math.pow(Math.clamp((i - min2) / range2, 0, 1), exp) * range + min);
                }
            }
            newimg = ctx.createImageData(image.width, image.height);
            for (var i = 0; i < newimg.data.length; i += 4) {
                newimg.data[i] = ALU[0][image.data[i]];
                newimg.data[i + 1] = ALU[1][image.data[i + 1]];
                newimg.data[i + 2] = ALU[2][image.data[i + 2]];
                newimg.data[i + 3] = ALU[3][image.data[i + 3]];
            }
            ctx2.putImageData(newimg, 0, 0);
            resetColorChart(ALU);
            return newimg;
        }
    } catch(err) {
        alert("contrast stretch: " + err.message);
    }
}