$(document).ready(function() {
    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });

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
        return density.blobs.removeNoise(image, blobs, 0.9);
    }

    var detectFaceFeatures = function(img, blobs) {
        // Find 2 blobs most likely to be a pair of eyes.
        var evaluateEyesPair = (a, b) => {
            var dx = Math.abs(a.center.x - b.center.x);
            if (dx < a.size.width / 2 + b.size.width / 2) {
                return null;
            }
            // var s1 = Math.sqrt((a.size.width * a.size.width) + (a.size.height * a.size.height));
            // var s2 = Math.sqrt((b.size.width * b.size.width) + (b.size.height * b.size.height));
            var s1 = a.counts;
            var s2 = b.counts;
            return Math.abs(a.center.y - b.center.y) * (s1 + s2);
        }
        var pairs = null;
        var min_dist = Number.POSITIVE_INFINITY;
        for (var i = 0; i < blobs.length; i++) {
            for (var j = 0; j < blobs.length; j++) {
                if (i != j) {
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
            eyes = {
                left: blobs[pairs[0]],
                right: blobs[pairs[1]]
            }
            if (eyes.left.center.x > eyes.right.center.x) {
                var t = eyes.left;
                eyes.left = eyes.right;
                eyes.right = t;
            }
            blobs.splice(pairs[0], 1);
            blobs.splice(pairs[1], 1);
        }
        var mouth = null;
        if (eyes != null) {
            // Find mouth.
            var evaluateMouth = function(b) {
                if (b.ratio > 1.2) {
                    return null;
                }
                if (b.density < 0.3) {
                    return null;
                }
                // Mouth must be below of eyes.
                if ((b.center.y <= eyes.left.center.y) || (b.center.y <= eyes.right.center.y)) {
                    return null;
                }
                // Mouth's center is between the eyes.
                if ((b.center.x <= eyes.left.center.x - eyes.left.size.width / 2) || (b.center.x >= eyes.right.center.x + eyes.right.size.width / 2)) {
                    return null;
                }
                var dist = Math.abs((eyes.left.center.y + eyes.right.center.y) / 2 - b.center.y);
                return b.counts * dist;
            }
            var mouthEval = 0;
            for (var i = 0; i < blobs.length; i++) {
                var d = evaluateMouth(blobs[i]);
                if (d != null) {
                    if (d > mouthEval) {
                        mouth = i;
                        mouthEval = d;
                    }
                }
            }
            mouth = blobs[mouth];
        }
        return {
            eyes: eyes,
            mouth: mouth
        }
    }

    var drawFeaturesRect = function(ctx, features) {
        ctx.putImageData(image_default, 0, 0);
        if (features.eyes != null) {
            var b;
            ctx.fillStyle = "";
            ctx.strokeStyle = "green";
            b = features.eyes.left;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            b = features.eyes.right;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            ctx.stroke();
        }
        if (features.mouth != null) {
            var b;
            ctx.fillStyle = "";
            ctx.strokeStyle = "green";
            b = features.mouth;
            ctx.rect(b.boundary.min.x, b.boundary.min.y, b.size.width, b.size.height);
            ctx.stroke();
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
    }

    var edgeFeaturesDetection = function() {
        resetPixels();
        var face = medianFilter(image);
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
        density.blobs.selectLargest(image, blobs);
        var mask = density.createDensityMap(image, util.neighbours.identity);
        image = edges;
        image = density.mask.image(mask, image);
        map = density.createDensityMap(image, util.neighbours.identity);
        blob = density.blobs.label(map);
        blobs = density.blobs.retrieve(blob);
        blobs = density.blobs.removeNoise(image, blobs, 0.95);
        return detectFaceFeatures(image, blobs);
    }

    var ffAlgorithm = function() {
        resetPixels();
        image = medianFilter(image);
        image = findFaceObject(image);
        var map_skin = density.createDensityMap(image, util.neighbours.identity);
        var maxb = detectFace(map_skin);
        var blobs = negativeHole(maxb);
        return detectFaceFeatures(image, blobs);
    }

    $('#button-recog-1').click(function() {
        var features = edgeFeaturesDetection();
        fillFeatures(image, features);
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-recog-2').click(function() {
        var features = edgeFeaturesDetection();
        drawFeaturesRect(ctx2, features);
    });

    $('#button-recog-3').click(function(){
        var features = ffAlgorithm();
        fillFeatures(image, features);
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-recog-4').click(function(){
        var features = ffAlgorithm();
        drawFeaturesRect(ctx2, features);
    });


});