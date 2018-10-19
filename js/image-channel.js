function setChannel(image, r, g, b) {
    try {
        if (counts) {
            newimg = ctx.createImageData(image.width, image.height);
            for (var i = 0; i < newimg.data.length; i += 4) {
                newimg.data[i] = image.data[i] * r;
                newimg.data[i + 1] = image.data[i + 1] * g;
                newimg.data[i + 2] = image.data[i + 2] * b;
                newimg.data[i + 3] = image.data[i + 3];
            }
            // image = newimg;
            return newimg;
        } else {
            alert("Please upload an image or take a picture with camera.")
        }
    } catch(err) {
        alert("setchannel: " + err.message);
    }
}

function setGrayscale(image) {
    try {
        if (counts) {
            for (var i = 0; i < 4; i++) {
                color_chart.data.datasets[i].data = counts[3];
            }
            color_chart.update();
            newimg = ctx.createImageData(image.width, image.height);
            for (var i = 0; i < newimg.data.length; i += 4) {
                var val = Math.round((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3)
                newimg.data[i] = val;
                newimg.data[i + 1] = val;
                newimg.data[i + 2] = val;
                newimg.data[i + 3] = image.data[i + 3];
            }
            return newimg;
        } else {
            alert("Please upload an image or take a picture with camera.")
        }
    } catch(err) {
        alert("grayscaling: " + err.message);
    }
}

function setBlackWhite(img) {
    try {
        var newimg = ctx.createImageData(img.width, img.height);
        for (var i = 0; i < img.data.length; i += 4) {
            let grey = (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 3;
            if (grey > 127) {
                grey = 255;
            } else {
                grey = 0;
            }
            newimg.data[i] = grey;
            newimg.data[i + 1] = grey;
            newimg.data[i + 2] = grey;
            newimg.data[i + 3] = 255;
        }
        return newimg;
    } catch(err) {
        alert("blackwhite: " + err.message);
    }
}

function inverseColor(image) {
    try {
        if (counts) {
            for (var i = 0; i < 3; i++) {
                color_chart.data.datasets[i].data = 255 - counts[i];
            }
            color_chart.update();
            newimg = ctx.createImageData(image.width, image.height);
            for (var i = 0; i < newimg.data.length; i += 4) {
                newimg.data[i] = 255 - image.data[i];
                newimg.data[i + 1] = 255 - image.data[i + 1];
                newimg.data[i + 2] = 255 - image.data[i + 2];
                newimg.data[i + 3] = image.data[i + 3];
            }
            ctx2.putImageData(newimg, 0, 0);
            return newimg;
        } else {
            alert("Please upload an image or take a picture with camera.")
        }
    } catch(err) {
        alert("inversing: " + err.message);
    }
}