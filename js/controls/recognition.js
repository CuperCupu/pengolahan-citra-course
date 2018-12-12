$(document).ready(function() {
    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });

    var detectMataSipit = function(features) {
        if (features.eyes != null) {
            var w = Math.min(features.eyes.left.ratio, features.eyes.right.ratio);
            if (w < 0.4) {
                return "matanya sipit";
            } else {
                return "matanya gede";
            }
        }
        return null;
    }

    var detectFace = function(map_skin) {
        var blob = density.blobs.label(map_skin);
        var blobs = density.blobs.retrieve(blob);
        image = density.visualizer.visualize(blob, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        return density.blobs.selectLargest(image, blobs);
    }

    var negativeHole = function(maxb) {
        var vis = density.createDensityMap(image, util.neighbours.identity);
        var b = findBoundary(image);
        var trace = new density.DensityMap(image.width, image.height);
        trace.map(_ => 0);
        for (var k in b.trace) {
            trace.setAt(b.trace[k].x, b.trace[k].y, 1);
        }
        var filled = density.filler.fill(trace, Math.round(maxb.center.x), Math.round(maxb.center.y));
        filled.sub(trace);
        var hole = density.copy(filled).sub(vis);
        image = density.visualizer.visualize(hole, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        var blob = density.blobs.label(hole);
        var blobs = density.blobs.retrieve(blob);
        if (blobs) {
            return density.blobs.removeNoise(image, blobs, 0.9);
        }
    }

    var evaluateEyesPair = (a, b) => {
        var dx = Math.abs(a.center.x - b.center.x);
        if (dx <= a.size.width / 3 + b.size.width / 3) {
            return null;
        }
        if ((a.ratio > 1) || (b.ratio > 1)) {
            return null;
        }
        // var s1 = Math.sqrt((a.size.width * a.size.width) + (a.size.height * a.size.height));
        // var s2 = Math.sqrt((b.size.width * b.size.width) + (b.size.height * b.size.height));
        var s1 = a.counts;
        var s2 = b.counts;
        // console.log(dx, Math.abs(a.center.y - b.center.y), (s1 + s2), Math.abs(a.center.y - b.center.y) / (s1 + s2));
        return (Math.abs(a.center.y - b.center.y)) / Math.sqrt(s1 * s2);
        // return Math.abs(a.center.y - b.center.y);
    }

    var evaluateMouth = function(b, eyes) {
        if (b.ratio > 1) {
            return null;
        }
        if (b.density < 0.2) {
            return null;
        }
        // Mouth must be below of eyes.
        if ((b.center.y <= eyes.left.center.y) || (b.center.y <= eyes.right.center.y)) {
            return null;
        }
        // Mouth's center is between the eyes.
        if ((b.center.x <= eyes.left.boundary.min.x) || (b.center.x >= eyes.right.boundary.max.x)) {
            return null;
        }
        var dist = Math.abs((eyes.left.center.y + eyes.right.center.y) / 2 - b.center.y);
        var center_dist = Math.abs((eyes.left.center.x + eyes.right.center.x) / 2 - b.center.x);
        return b.counts * (dist - 2 * center_dist);
    }

    var generateNoseEvaluator = function(eyes, mouth) {
        var boundary = {
            min: {
                x: mouth.boundary.min.x,
                // x: Math.min(eyes.left.boundary.min.x, eyes.right.boundary.min.x, mouth.boundary.min.x),
                // y: Math.min(eyes.left.boundary.min.y, eyes.right.boundary.min.y, mouth.boundary.min.y)
                y: Math.min(eyes.left.boundary.min.y, eyes.right.boundary.min.y)
            },
            max: {
                x: mouth.boundary.max.x,
                // x: Math.max(eyes.left.boundary.max.x, eyes.right.boundary.max.x, mouth.boundary.max.x),
                // y: Math.max(eyes.left.boundary.max.y, eyes.right.boundary.max.y, mouth.boundary.max.y)
                y: Math.max(eyes.left.boundary.max.y, eyes.right.boundary.max.y, mouth.boundary.min.y)
            }
        }
        var evaluateNose = function(b) {
            if (
                (b.boundary.min.x > boundary.min.x)  && 
                (b.boundary.max.x < boundary.max.x) && 
                (b.boundary.min.y > boundary.min.y) && 
                (b.boundary.max.y < boundary.max.y)
            ) {
                return true;
            }
            return false;
        }
        return evaluateNose;
    }

    var detectFaceFeatures = function(img, blobs, it, paired = []) {
        if (it == 0) {
            return [];
        }
        // Find 2 blobs most likely to be a pair of eyes.
        var pairs = null;
        var min_dist = Number.POSITIVE_INFINITY;
        for (var i = 0; i < blobs.length; i++) {
            for (var j = 0; j < blobs.length; j++) {
                if ((i != j) && (paired.findIndex(x => x[0] == i && x[1] == j) < 0)) {
                    var d = evaluateEyesPair(blobs[i], blobs[j]);
                    if (d != null) {
                        if (d < min_dist) {
                            pairs = [i, j];
                            min_dist = d;
                        }
                    }
                }
            }
        }
        var eyes = null;
        if (pairs != null) {
            paired.push(pairs);
            eyes = {
                left: blobs[pairs[0]],
                right: blobs[pairs[1]]
            }
            if (eyes.left.center.x > eyes.right.center.x) {
                var t = eyes.left;
                eyes.left = eyes.right;
                eyes.right = t;
            }
            var t = blobs;
            blobs = [];
            for (var k in t) {
                if ((k != pairs[0]) && (k != pairs[1])) {
                    blobs.push(t[k]);
                }
            }
        }
        var mouth = null;
        if (eyes != null) {
            // Find mouth.
            var mouthEval = 0;
            for (var i = 0; i < blobs.length; i++) {
                if (i in blobs) {
                    var d = evaluateMouth(blobs[i], eyes);
                    if (d != null) {
                        if (d > mouthEval) {
                            mouth = i;
                            mouthEval = d;
                        }
                    }
                }
            }
            var i = mouth;
            mouth = blobs[mouth];
            var t = blobs;
            blobs = [];
            for (var k in t) {
                if (k != i) {
                    blobs.push(t[k]);
                }
            }
        }
        var nose = null;
        if ((eyes != null) && (mouth != null)) {
            evaluateNose = generateNoseEvaluator(eyes, mouth);
            var candidates = [];
            var t = blobs;
            blobs = [];
            for (var k in t) {
                if (evaluateNose(t[k])) {
                    candidates.push(t[k]);
                } else {
                    blobs.push(t[k]);
                }
            }
            nose = util.misc.reduce(candidates, density.blobs.merge);
        }
        var res = [];
        if ((eyes != null) && (mouth != null) && (nose != null)) {
            var boundary = {
                min: {
                    x: Math.min(eyes.left.boundary.min.x, mouth.boundary.min.x),
                    y: Math.min(eyes.left.boundary.min.y, eyes.right.boundary.min.y)
                },
                max: {
                    x: Math.max(eyes.right.boundary.max.x, mouth.boundary.max.x),
                    y: mouth.boundary.max.y
                }
            }
            var blobInBound = function(b) {
                if (
                    (b.boundary.min.x > boundary.min.x)  && 
                    (b.boundary.max.x < boundary.max.x) && 
                    (b.boundary.min.y > boundary.min.y) && 
                    (b.boundary.max.y < boundary.max.y)
                ) {
                    return true;
                }
                return false;
            };
            var t = blobs;
            blobs = [];
            for (var k in t) {
                if (!blobInBound(t[k])) {
                    blobs.push(t[k]);
                }
            }
            res.push({
                eyes: eyes,
                mouth: mouth,
                nose: nose,
                whole: util.misc.reduce([eyes.left, eyes.right, mouth, nose], density.blobs.merge)
            });
            res = res.concat(detectFaceFeatures(img, blobs, it - 1, paired));
        } else if (eyes != null) {
            blobs.push(eyes.left, eyes.right);
            if (mouth != null) {
                blobs.push(mouth);
            }
            if (nose != null) {
                blobs.push(nose);
            }
            global_blobs = blobs;
            res = res.concat(detectFaceFeatures(img, blobs, it - 1, paired));
        }
        return res;
    }

    var global_blobs;

    var drawFeaturesRect = function(ctx, features) {
        if (features.eyes != null) {
            var b;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.fillStyle = "";
            ctx.strokeStyle = "green";
            b = features.eyes.left;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            b = features.eyes.right;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            ctx.stroke();
            ctx.closePath();
        }
        if (features.mouth != null) {
            var b;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.fillStyle = "";
            ctx.strokeStyle = "green";
            b = features.mouth;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            ctx.stroke();
            ctx.closePath();
        }
        if (features.nose != null) {
            var b;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.fillStyle = "";
            ctx.strokeStyle = "green";
            b = features.nose;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            ctx.stroke();
            ctx.closePath();
        }
        if (features.whole != null) {
            var b;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.fillStyle = "";
            ctx.strokeStyle = "blue";
            b = features.whole;
            var o = {
                x: b.size.width * 0.1,
                y: b.size.height * 0.1
            }
            ctx.rect(b.boundary.min.x - o.x, b.boundary.min.y - o.y, b.size.width + (2 * o.x), b.size.height + (2 * o.y));
            ctx.stroke();
            ctx.closePath();
        }
        setDirty(ctx.canvas);
    }

    var fillFeatures = function(img, features) {
        if (features.eyes != null) {
            var b;
            b = features.eyes.left;
            density.blobs.fill(img, b, new Color(255, 0, 0, 255));
            b = features.eyes.right;
            density.blobs.fill(img, b, new Color(255, 0, 0, 255));
        }
        if (features.mouth != null) {
            var b;
            b = features.mouth;
            density.blobs.fill(img, b, new Color(0, 255, 0, 255));
        }
        if (features.nose != null) {
            var b;
            b = features.nose;
            density.blobs.fill(img, b, new Color(0, 0, 255, 255));
        }
    }

    $('#button-preprocess0').on('click', (e) => {
        resetPixels();
        image = operator(image,
            operators.sobel,
            3, -1, true
        );
        image = contrastStretch(image, -100, 300, 0, 255);
        var map = density.createDensityMap(image, util.neighbours.square(1));
        var avg = map.getAverage();
        image = setBlackWhite(image, avg * 0.05);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
    $('#button-skinmap').on('click', (e) => {
        resetPixels();
        var face = medianFilter(image);
        // image = contrastStretch(face, -50, 200, 0, 255);
        var map_skin = skinmap.YCbCr(face);
        var blob = density.blobs.label(map_skin);
        var blobs = density.blobs.retrieve(blob);
        image = density.visualizer.visualize(blob, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        // image = density.visualizer.visualize(map_skin, density.visualizer.cm.binary, {
        //     low: new Color(0, 0, 0, 255),
        //     high: new Color(255, 255, 255, 255),
        //     cutoff: 1
        // })
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    var edgeFeaturesDetection = function() {
        resetPixels();
        // equalizePixels();
        var face = medianFilter(image);
        // image = contrastStretch(face, -50, 200, 0, 255);
        var map_skin = skinmap.YCbCr(face);
        var blob = density.blobs.label(map_skin);
        var blobs = density.blobs.retrieve(blob);
        face = density.visualizer.visualize(blob, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        image = operator(image,
            operators.sobel,
            3, -1, true
        );
        image = contrastStretch(image, -100, 300, 0, 255);
        var map = density.createDensityMap(image, util.neighbours.square(1));
        var avg = map.getAverage();
        image = setBlackWhite(image, avg * 0.05);
        var edges = image;
        image = density.visualizer.visualize(map_skin, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        image = face;
        // density.blobs.selectLargest(image, blobs);
        var mask = density.createDensityMap(image, util.neighbours.identity);
        image = edges;
        image = density.mask.image(mask, image);
        map = density.createDensityMap(image, util.neighbours.identity);
        blob = density.blobs.label(map);
        blobs = density.blobs.retrieve(blob);
        blobs = density.blobs.removeNoise(image, blobs, 0.95);
        console.log(blobs);
        return detectFaceFeatures(image, blobs, blobs.length);
    }

    var ffAlgorithm = function() {
        resetPixels();
        image = medianFilter(image);
        image = findFaceObject(image);
        var map_skin = density.createDensityMap(image, util.neighbours.identity);
        var maxb = detectFace(map_skin);
        var blobs = negativeHole(maxb);
        return detectFaceFeatures(image, blobs, blobs.length);
    }

    $('#button-recog-1').click(function() {
        var features = edgeFeaturesDetection();
        // ctx2.fillStyle = "black";
        // ctx2.fillRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
        // image = ctx2.getImageData(0, 0, image.width, image.height);
        for (var k in features) {
            fillFeatures(image, features[k]);
        }
        for (var k in global_blobs) {
            density.blobs.fill(image, global_blobs[k], new Color(255, 0, 255, 255));
        }
        console.log(detectMataSipit(features));
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-recog-2').click(function() {
        var features = edgeFeaturesDetection();
        ctx2.putImageData(image_default, 0, 0);
        for (var k in features) {
            drawFeaturesRect(ctx2, features[k]);
        }
        console.log(detectMataSipit(features));
    });

    $('#button-recog-3').click(function(){
        var features = ffAlgorithm();
        for (var k in features) {
            fillFeatures(image, features[k]);
        }
        console.log(detectMataSipit(features));
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-recog-4').click(function(){
        var features = ffAlgorithm();
        ctx2.putImageData(image_default, 0, 0);
        for (var k in features) {
            drawFeaturesRect(ctx2, features[k]);
            console.log(detectMataSipit(features[k]));
        }
    });


});