$(document).ready(function() {
    
    ctx4 = document.getElementById("spec_chart").getContext("2d");
    spec_chart = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: Array.from(Array(256).keys()),
            datasets: [{
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
            'onClick': (evt, item) => {
                if (custom_spec_enabled) {
                    var activePoints = spec_chart.getElementsAtEvent(evt);
                    var firstPoint = activePoints[0];
                    var scaler=spec_chart.scales['y-axis-0'];
                    var y=evt.offsetY-scaler.top;
                    var yval=scaler.max-y/scaler.height*(scaler.max-scaler.min);
                    
                    var scaler2=spec_chart.scales['x-axis-0'];
                    var pl = parseInt($("#spec_chart").css('padding-left'));
                    var pr = parseInt($("#spec_chart").css('padding-right'));
                    var width = scaler2.width - pl - pr;
                    var x=evt.offsetX-scaler2.left;
                    var xval=(x - pl)/width*(scaler2.max-scaler2.min);
                    xval = Math.round(xval);
                    yval = Math.round(yval);
                    var obj = {
                        x: xval,
                        y: yval
                    };
                    if ((xval >= 0) && (xval < 255) && (yval >= 0) && (yval < 100)) {
                        var i = 0;
                        while ((points[i].x < obj.x) && (i < points.length - 1)) {
                            i++;
                        }
                        var dist1 = Math.abs(points[i - 1].x - obj.x);
                        var dist2 = Math.abs(points[i].x - obj.x);
                        if (dist1 < dist2) {
                            points[i - 1].y = obj.y;
                        } else {
                            points[i].y = obj.y;
                        }
                        redrawPoints();
                        setHistSpecification();
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 100,
                        beginAtZero: true,
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 15
                    }
                }]
            },
            elements: {
                point: {
                    radius: 3,
                    hitRadius: 0,
                    hoverRadius: 0
                }
            }
        }
    });
    
    resetPoints();
})

var points = [];
var default_y = 10;
var points_count = 8;
function resetPoints() {
    points = [];
    for (var i = 0; i < points_count; i++) {
        var obj = {
            x: Math.round(i / (points_count - 1) * 255),
            y: default_y
        };
        points.push(obj);
    }

    redrawPoints()
}

function addPoint(p) {
    var idx = -1;
    var i = 0;
    while ((idx == -1) && (i < points.length)) {
        if (points[i].x == p.x) {
            idx = i;
        }
        i++;
    }
    if (idx != -1) {
        points.splice(i - 1, 1);
    }
    points.push(p);
    points.sort((a, b) => {
        if (a.x > b.x) {
            return 1;
        } else if (a.x < b.x) {
            return -1;
        } else {
            return 0;
        }
    });
}

function removePoint(p) {
    var idx = -1;
    var i = 0;
    while ((idx == -1) && (i < points.length)) {
        if (points[i].x == p.x) {
            idx = i;
        }
        i++;
    }
    if (idx != -1) {
        points.splice(i - 1, 1);
    }
}

function redrawPoints() {
    for (var i = 0 ; i < 4; i++) {
        spec_chart.data.datasets[i].data = points;
    }
    spec_chart.update();
    // Draw a curve at a temporary canvas.
    var tcvs = document.createElement('canvas');
    tcvs.width = 256;
    tcvs.height = 100;
    var tctx = tcvs.getContext('2d');
    var w = tctx.canvas.width/255;
    var h = tctx.canvas.height/100;
    tctx.clearRect(0, 0, tctx.canvas.width, tctx.canvas.height);
    tctx.beginPath(); 
    tctx.lineWidth="1";
    tctx.strokeStyle="black";
    var cp = [];
    tension = 0.25;
    cp.push({
        x: points[0].x + (points[1].x - points[0].x) * tension,
        y: points[0].y + (points[1].y - points[0].y) * tension
    });
    for (var i = 1; i < points.length - 1; i++) {
        cp.push({
            x: points[i].x + (points[i - 1].x - points[i + 1].x) * tension / 2,
            y: points[i].y + (points[i - 1].y - points[i + 1].y) * tension / 2
        });
        cp.push({
            x: points[i].x + (points[i + 1].x - points[i - 1].x) * tension / 2,
            y: points[i].y + (points[i + 1].y - points[i - 1].y) * tension / 2
        });
    }
    cp.push({
        x: points[points.length - 1].x + (points[points.length - 2].x - points[points.length - 1].x) * tension,
        y: points[points.length - 1].y + (points[points.length - 2].y - points[points.length - 1].y) * tension
    });
    tctx.moveTo(points[0].x * w, points[0].y * h);
    for (var i = 1; i < points.length; i++) {
        tctx.bezierCurveTo(cp[(i - 1) * 2].x * w, cp[(i - 1) * 2].y * h, cp[(i - 1) * 2 + 1].x * w, cp[(i - 1) * 2 + 1].y * h, points[i].x * w, points[i].y * h);
    }
    tctx.stroke();
    // Get the curve values.
    var vals = new Array(256);
    var height = tctx.canvas.width;
    for (var i = 0; i < 256; i++) {
        var iData = tctx.getImageData(i, 0, 1, tctx.canvas.height);
        var data = iData.data;
        for (var y=0; y<height; y++) {
            if (data[y*4+3]>10) {
                vals[i]=y/h;
                break;
            }
        }
    }
    var acc = equalizeChannel(vals);
    reference_freq = new Array(4);
    for (var i = 0 ; i < 4; i++) {
        reference_freq[i] = acc;
    }
}

function toggleCustomSpec() {
    custom_spec_enabled = !custom_spec_enabled;
    if (custom_spec_enabled) {
        redrawPoints();
    }
}

function resetSpecChart(frequency) {
    for (var i = 0; i < 4; i++) {
        spec_chart.data.datasets[i].data = frequency[i];
    }
    spec_chart.update();
}

function saveSpecification() {
    custom_spec_enabled = false;
    if (counts) {
        reference_freq = new Array(4)
        for (var i = 0; i < 4; i ++) {
            reference_freq[i] = equalizeChannel(counts[i]);
        }
        var normalized_count = new Array(4);
        var maxs = new Array(4);
        for (var i = 0; i < 4; i ++) {
            maxs[i] = Math.max.apply(Math, counts[i]);
        }
        var max = Math.max.apply(Math, maxs);
        console.log(max);
        for (var i = 0; i < 4; i ++) {
            normalized_count[i] = new Array(256);
            for (var j = 0; j < counts[i].length; j++) {
                normalized_count[i][j] = counts[i][j] / max * 100;
            }
        }
        resetSpecChart(normalized_count);
    }
}

function generateHistMatchALU(current, reference) {
    var result = Array(256);
    for (var i = 0; i < 256; i++) {
        var j = 0;
        while ((j < 256) && (current[i] !== reference[j])) {
            j++;
        }
        if (j < 256) {
            result[i] = j;
        }
    }
    var last = 0;
    for (var i = 0; i < 256; i++) {
        if (result[i]) {
            last = result[i];
        } else {
            result[i] = last;
        }
    }
    return result;
}

function setHistSpecification() {
    try {
        if ((counts) && (reference_freq)) {
            var accum = new Array(3);
            var ALU = new Array(3);
            for (var i = 0; i < 3; i++) {
                accum[i] = equalizeChannel(counts[i]);
                ALU[i] = generateHistMatchALU(accum[i], reference_freq[i]);
            }
            newimg = ctx.createImageData(image.width, image.height);
            for (var i = 0; i < newimg.data.length; i += 4) {
                newimg.data[i] = ALU[0][image.data[i]];
                newimg.data[i + 1] = ALU[1][image.data[i + 1]];
                newimg.data[i + 2] = ALU[2][image.data[i + 2]];
                newimg.data[i + 3] = image.data[i + 3];
            }
            ctx2.putImageData(newimg, 0, 0);
            for (var i = 0; i < 4; i++) {
                accum[i] = equalizeChannel(counts[i]);
            }
            resetColorChart(countPixels(newimg));
            return newimg;
        }
    } catch(err) {
        alert("specification: " + err.message);
    }
}