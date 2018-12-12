$(document).ready(function() {
    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });

    var trace = function(ori_img, blob) {
        var t_img = ctx.createImageData(ori_img.width, ori_img.height);
        density.blobs.fill(t_img, blob, new Color(255, 255, 255, 255));
        var b = findBoundary(t_img);
        var trace = new density.DensityMap(ori_img.width, ori_img.height);
        trace.map(_ => 0);
        for (var k in b.trace) {
            trace.setAt(b.trace[k].x, b.trace[k].y, 1);
        }
        var filled = density.filler.fill(trace, Math.round(blob.center.x), Math.round(blob.center.y));
        filled.sub(trace);
        return {
            filled: filled,
            trace: trace
        };
    }

    var preprocessSkin = function(img) {
        var face = medianFilter(img);
        var map_skin = skinmap.YCbCr(face);
        var blob = density.blobs.label(map_skin);
        face = density.visualizer.visualize(blob, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        return face;
    }

    var mask = function(img, mask) {
        mask = density.createDensityMap(mask, util.neighbours.identity);
        mask.normalize();
        return density.mask.image(mask, img);
    }

    var getSkinBlobs = function(img) {
        img = util.image.copy(img);
        var sm = preprocessSkin(img);
        var blobs = retrieveBlobs(sm);
        blobs = density.blobs.removeNoise(img, blobs, 0.99);
        blobs.sort((a, b) => { return b.counts - a.counts});
        return blobs;
    }

    var getSkinMask = function(img) {
        var blobs = getSkinBlobs(img);
        return density.visualizer.visualize(trace(img, blobs[0]).filled, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        });
    }

    var preprocess = function(img) {

        img = operator(img,
            operators.sobel,
            3, -1, true
        );
        img = contrastStretch(img, -100, 300, 0, 255);
        img = contrastStretch(img, -75, 275, 0, 255);
        // img = contrastStretch(img, -100, 300, 0, 255);

        return img;
    }

    var retrieveBlobs = function(img) {
        var map = density.createDensityMap(img, util.neighbours.identity);
        var blob = density.blobs.label(map);
        var r_blobs = density.blobs.retrieve(blob);
        var blobs = [];
        for (var k in r_blobs) {
            blobs.push(r_blobs[k]);
        }
        return blobs;
    }

    var process = function(img, threshold = 0.99) {
        img = util.image.copy(img);
        // Detect blobs
        var blobs = retrieveBlobs(img);
        blobs = density.blobs.removeNoise(img, blobs, threshold);
        img = ctx.createImageData(img.width, img.height);;
        util.image.clear(img);
        for (var k in blobs) {
            var b = blobs[k];
            density.blobs.fill(img, b, new Color(255, 255, 255, 255));
        }
        return img;
    }

    var negativeHoles = function(img) {
        img = util.image.copy(img);
        var skin_blobs = getSkinBlobs(img);
        var blob = skin_blobs[0];
        var skin_mask_density = trace(img, blob).filled;
        var skin_mask = density.visualizer.visualize(skin_mask_density, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        });


        var img = mask(img, skin_mask);
        img = contrastStretch(img, -100, 300, 0, 255);
        img = setBlackWhite(img, 50);

        for (var i = 0; i < skin_mask_density.data.length; i++) {
            if (skin_mask_density.data[i] > 0) {
                var p = i * 4;
                img.data[p] = 255 - img.data[p];
                img.data[p + 1] = 255 - img.data[p + 1];
                img.data[p + 2] = 255 - img.data[p + 2];
            }
        }
        return img;
    }

    $('#button-cp-1').click(function() {
        resetPixels();
        // Get skin as mask.
        var skin_mask = getSkinMask(image);

        image = preprocess(image);
        image = process(image, 0.995);
        image = mask(image, skin_mask);

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-cp-2').click(function() {
        resetPixels();
        image = medianFilter(image);

        image = negativeHoles(image);

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    var arrange_matrix = function(clusters) {
        var matrix = {};
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        matrix.data = {};
        for (var k in clusters) {
            var p = clusters[k];
            var x = p[0];
            if (!(x in matrix.data)) {
                matrix.data[x] = [];
            }
            matrix.data[x].push(p[1]);
            if (x < min) {
                min = x;
            }
            if (x > max) {
                max = x;
            }
        }
        matrix.start = min;
        matrix.end = max;
        return matrix;
    }

    var thickest_x = function(mat) {
        var thickest = null;
        var size = 0;
        for (var k in mat.data) {
            if (mat.data[k].length > size) {
                thickest = k;
                size = mat.data[k].length;
            }
        }
        return thickest;
    }

    var retrieveBlobsDual = function(img, noise_threshold = 10) {
        var skin_mask = getSkinMask(img);

        var img_edge = preprocess(img);
        img_edge = process(img_edge, 0.995);
        img_edge = mask(img_edge, skin_mask);
        var blobs_edge = retrieveBlobs(img_edge);

        var img_neg = medianFilter(img);
        img_neg = negativeHoles(img_neg);
        var blobs_neg = retrieveBlobs(img_neg);
        // Filter noises.
        blobs_edge = blobs_edge.filter(e => e.counts > noise_threshold);
        blobs_neg = blobs_neg.filter(e => e.counts > noise_threshold);
        return {
            edge: blobs_edge,
            neg: blobs_neg
        }
    }

    $('#button-cp-3').click(function() {
        resetPixels();

        var blobs = retrieveBlobsDual(image);

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);

        for (var k in blobs.edge) {
            var blob = blobs.edge[k];
            var mat = arrange_matrix(blob.clusters);
            var x = thickest_x(mat);
            var y = (mat.data[x][mat.data[x].length - 1] + mat.data[x][0]) / 2;
            ctx2.beginPath();
            ctx2.strokeStyle = "green";
            ctx2.lineWidth = 1;
            ctx2.arc(x, y, 5, 0, 2 * Math.PI);
            ctx2.stroke();
        }

        for (var k in blobs.neg) {
            var blob = blobs.neg[k];
            var mat = arrange_matrix(blob.clusters);
            var x = thickest_x(mat);
            var y = (mat.data[x][mat.data[x].length - 1] + mat.data[x][0]) / 2;
            ctx2.beginPath();
            ctx2.strokeStyle = "red";
            ctx2.lineWidth = 1;
            ctx2.arc(x, y, 5, 0, 2 * Math.PI);
            ctx2.stroke();
        }

        setDirty(canvas2);
    });

});