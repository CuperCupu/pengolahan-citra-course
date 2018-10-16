var ctx3;
var color_chart;
var ctx4;
var spec_chart;

$(document).ready(function() {
    ctx3 = document.getElementById("main_chart").getContext("2d");
    color_chart = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: Array.from(Array(256).keys()),
            datasets: [{
                lineTension: 0,
                label: 'Red',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            },{
                lineTension: 0,
                label: 'Green',
                data: [],
                backgroundColor: [
                    'rgba(99, 255, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(99, 255, 132, 1)',
                ],
                borderWidth: 1
            },{
                lineTension: 0,
                label: 'Blue',
                data: [],
                backgroundColor: [
                    'rgba(99, 132, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(99, 132, 255, 1)',
                ],
                borderWidth: 1
            },{
                lineTension: 0,
                label: 'Grayscale',
                data: [],
                backgroundColor: [
                    'rgba(128, 128, 128, 0.2)',
                ],
                borderColor: [
                    'rgba(128, 128, 128, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMax: 255,
                        beginAtZero:true
                    }
                }]
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 0,
                    hoverRadius: 0
                }
            }
        }
    });

});

function resetColorChart(frequency) {
    for (var i = 0; i < 4; i++) {
        color_chart.data.datasets[i].data = frequency[i];
    }
    color_chart.update();
}

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
            resetColorChart(accum);
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
    try {
        if (counts) {
            for (var i = 0; i < 4; i++) {
                color_chart.data.datasets[i].data = counts[i];
            }
            color_chart.update();
            ctx2.putImageData(image_default, 0, 0);
            image.data.set(image_default.data);
            for (var i in onReset) {
                onReset[i]();
            }
        } else {
            alert("Please upload an image or take a picture with camera.")
        }
    } catch(err) {
        alert("resetting: " + err.message);
    }
}