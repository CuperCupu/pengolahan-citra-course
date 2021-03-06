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

    var getSkinMask = function(img, index = 0) {
        var blobs = getSkinBlobs(img);
        return density.visualizer.visualize(trace(img, blobs[index]).filled, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        });
    }

    var getSkinMasks = function(img) {
        var blobs = getSkinBlobs(img);
        var results = [];
        for (var k in blobs) {
            var blob = trace(img, blobs[k]).filled;
            results.push(density.visualizer.visualize(blob, density.visualizer.cm.binary, {
                low: new Color(0, 0, 0, 255),
                high: new Color(255, 255, 255, 255),
                cutoff: 1
            }));
        }
        return results;
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

    var negativeHoles = function(img, skin_mask) {
        img = util.image.copy(img);

        var img = mask(img, skin_mask);
        img = contrastStretch(img, -100, 300, 0, 255);
        img = setBlackWhite(img, 50);

        var skin_mask_density = density.createDensityMap(skin_mask, util.neighbours.identity);

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

    var retrieveBlobsDual = function(img, skin_mask, index = 1, noise_threshold = 5) {

        var img_edge = preprocess(img);
        img_edge = process(img_edge, 0.995);
        img_edge = mask(img_edge, skin_mask);
        var blobs_edge = retrieveBlobs(img_edge);

        var img_neg = medianFilter(img);
        img_neg = negativeHoles(img_neg, skin_mask);
        var blobs_neg = retrieveBlobs(img_neg);
        // Filter noises.
        blobs_edge = blobs_edge.filter(e => e.counts > noise_threshold);
        blobs_neg = blobs_neg.filter(e => e.counts > noise_threshold);
        return {
            edge: blobs_edge,
            neg: blobs_neg
        }
    }

    var getBlobThickestX = function(blob) {
        var mat = arrange_matrix(blob.clusters);
        var x = thickest_x(mat);
        var y = (mat.data[x][mat.data[x].length - 1] + mat.data[x][0]) / 2;
        return {
            x: parseInt(x),
            y: y
        }
    }

    var markBlob = function(blobs, style, radius = 2) {
        for (var k in blobs) {
            var blob = blobs[k];
            var p = getBlobThickestX(blob);
            ctx2.beginPath();
            ctx2.strokeStyle = style;
            ctx2.lineWidth = 1;
            ctx2.arc(p.x, p.y, radius, 0, 2 * Math.PI);
            ctx2.stroke();
        }
    }

    var markPoints = function(points, style, radius = 2) {
        for (var k in points) {
            var p = points[k];
            if (p == null) {
                continue;
            }
            var x = p.x;
            var y = p.y;
            ctx2.beginPath();
            ctx2.strokeStyle = style;
            ctx2.lineWidth = 1;
            ctx2.arc(x, y, radius, 0, 2 * Math.PI);
            ctx2.stroke();
        }
    }

    var findEyesCandidate = function(blobs, threshold = 0.5) {
        var candidates = [];

        for (var k in blobs.neg) {
            var blob = blobs.neg[k];
            var mat = arrange_matrix(blob.clusters);
            var x = thickest_x(mat);
            var y = (mat.data[x][mat.data[x].length - 1] + mat.data[x][0]) / 2;
            var bool = false;
            for (var j in blobs.edge) {
                var blob_e = blobs.edge[j];
                var min = blob_e.boundary.min;
                var max = blob_e.boundary.max;
                bool = ((x >= min.x) && (x <= max.x) && (y >= min.y) && (y <= max.y))
                 && (blob.ratio <= 1.8)
                 && (blob_e.ratio < 0.8) && (blob_e.ratio > 0.2)
                 && ((Math.abs((max.x + min.x) / 2 - x) / ((max.x - min.x + 1) / 2)) < threshold);
                if (bool) {
                    blob.c = {
                        x: x,
                        y: y
                    }
                    blob.container = blob_e;
                    break;
                }
            }
            if (bool) {
                candidates.push(blob);
            }
        }

        return candidates;
    }

    var selectEyes = function(candidates) {
        var pairs = {
            left: null,
            right: null
        };
        var score = 0;
        for (var i in candidates) {
            for (var j in candidates) {
                if (i != j) {
                    var left;
                    var right;
                    if (candidates[i].center.x < candidates[j].center.x) {
                        left = candidates[i];
                        right = candidates[j];
                    } else {
                        left = candidates[j];
                        right = candidates[i];
                    }
                    var t_score = right.container.boundary.min.x - left.container.boundary.max.x;
                    if (t_score < 0) {
                        continue;
                    }
                    t_score /= Math.abs(right.c.y - left.c.y);
                    if (t_score > score) {
                        pairs.left = left;
                        pairs.right = right;
                        score = t_score;
                    }
                }
            }
        }
        return pairs;
    }

    var extractEyesCP = function(eyes) {
        var left = getBlobThickestX(eyes.left);
        var right = getBlobThickestX(eyes.right);
        var left_mat = arrange_matrix(eyes.left.container.clusters);
        var left_tip = {
            x: parseInt(left_mat.start),
            y: selectCenter(left_mat.data[left_mat.start])
        }; 
        var right_mat = arrange_matrix(eyes.right.container.clusters);
        var right_tip = { 
            x: parseInt(right_mat.end),
            y: selectCenter(right_mat.data[right_mat.end])
        };
        return {
            left_tip: left_tip,
            left: left,
            right: right,
            right_tip: right_tip,
        }
    }

    var findMouthCandidate = function(blobs, eyes) {
        var candidates = [];

        for (var k in blobs.edge) {
            var blob = blobs.edge[k];
            var bool = true;
            if ((blob.boundary.min.y <= eyes.left.container.boundary.max.y) 
                && (blob.boundary.min.y <= eyes.right.container.boundary.max.y)) {
                bool = false;
            }
            if (blob.ratio > 0.5) {
                bool = false;
            }
            if (bool) {
                candidates.push(blob);
            }
        }

        return mergeOverlappingBlobs(candidates);
    }

    var findNoseCandidate = function(blobs, eyes, mouth) {
        var candidate_edge = [];

        for (var k in blobs.edge) {
            var blob = blobs.edge[k];
            var bool = true;
            if ((blob.boundary.min.y <= eyes.left.container.boundary.max.y) 
                || (blob.boundary.min.y <= eyes.right.container.boundary.max.y)) {
                bool = false;
            }
            if ((blob.boundary.max.y >= mouth.boundary.min.y)
                || (blob.boundary.min.x < mouth.boundary.min.x)
                || (blob.boundary.max.x > mouth.boundary.max.x)) {
                bool = false;
            }
            if (blob.ratio > 1.5) {
                bool = false;
            }
            if (bool) {
                candidate_edge.push(blob);
            }
        }

        candidate_edge = mergeOverlappingBlobs(candidate_edge)

        var candidate_neg = [];

        for (var k in blobs.neg) {
            var blob = blobs.neg[k];
            var bool = true;
            if ((blob.boundary.min.y <= eyes.left.container.boundary.max.y) 
                || (blob.boundary.min.y <= eyes.right.container.boundary.max.y)) {
                bool = false;
            }
            if ((blob.boundary.max.y >= mouth.boundary.min.y)
                || (blob.boundary.min.x < mouth.boundary.min.x)
                || (blob.boundary.max.x > mouth.boundary.max.x)) {
                bool = false;
            }
            if (blob.ratio > 1.5) {
                bool = false;
            }
            if (bool) {
                candidate_neg.push(blob);
            }
        }

        candidate_neg = mergeOverlappingBlobs(candidate_neg)

        var candidates = [];

        for (var k in candidate_edge) {
            candidates.push(candidate_edge[k]);
        }
        for (var k in candidate_neg) {
            candidates.push(candidate_neg[k]);
        }

        return candidates;
    }

    var extractNoseCP = function(blobs, eyes, mouth) {
        var center = {
            x: Math.round((eyes.left_tip.x + eyes.right_tip.x) / 2),
            y: Math.round((eyes.left_tip.y + eyes.right_tip.y) / 2),
        }
        var left = null;
        var left_dist = Number.POSITIVE_INFINITY;
        var right = null;
        var right_dist = Number.POSITIVE_INFINITY;
        for (var k in blobs) {
            var p = getBlobThickestX(blobs[k]);
            if (p.x < center.x) {
                var dist = center.x - p.x;
                if (dist < left_dist) {
                    left_dist = dist;
                    left = p;
                }
            } else if (p.x > center.x) {
                var dist = p.x - center.x;
                if (dist < right_dist) {
                    right_dist = dist;
                    right = p;
                }
            }
        }
        return {
            left: left,
            right: right
        }
    }
    
    /**
     * @param blobs {Array} 
     */
    var mergeOverlappingBlobs = function(blobs) {
        var last = blobs.slice();
        var result = [];
        var changed = false;
        do {
            changed = false;
            for (var i in last) {
                for (var j in last) {
                    if (i != j) {
                        if (last[i].boundary.isOverlapping(last[j].boundary)) {
                            changed = true;
                            var merged = density.blobs.merge(last[i], last[j]);
                            for (var k in last) {
                                if ((k != i) && (k != j)) {
                                    result.push(last[k]);
                                }
                            }
                            result.push(merged);
                        }
                    }
                }
                if (changed) {
                    break;
                }
            }
            if (changed) {
                last = result;
                result = [];
            } else {
                result = last;
            }
        } while(changed);
        return result;
    }

    var selectMouth = function(blobs, eyes) {
        var mouth = null;
        var score = Number.NEGATIVE_INFINITY;
        var left = eyes.left.container.boundary.min.x;
        var right = eyes.right.container.boundary.max.x;
        for (var k in blobs) {
            var blob = blobs[k];
            var l = blob.boundary.min.x;
            var r = blob.boundary.max.x;
            var t_score = left - l + r - right;
            if (t_score > score) {
                score = t_score;
                mouth = blob;
            }
        }
        return mouth;
    }

    var selectCenter = function(arr) {
        arr.sort((a, b) => {return a - b});
        return Math.round((arr[arr.length - 1] + arr[0]) / 2);
    }

    var extractMouthCP = function(mouth) {
        var mat = arrange_matrix(mouth.clusters);
        var left = {
            x: parseInt(mat.start),
            y: selectCenter(mat.data[mat.start])
        };
        var right = {
            x: parseInt(mat.end),
            y: selectCenter(mat.data[mat.end]),
        }
        var center = {
            x: Math.round((right.x + left.x) / 2)
        }
        center.y = selectCenter(mat.data[center.x]);
        return {
            left: left,
            right: right,
            center: center
        }
    }

    var drawBoundary = function(ctx, boundary, style) {
        var b;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.fillStyle = "";
        ctx.strokeStyle = style;
        ctx.rect(boundary.min.x, boundary.min.y, boundary.getWidth(), boundary.getHeight());
        ctx.stroke();
        ctx.closePath();
    }

    var colors = [
        new Color(255, 0, 0, 255),
        new Color(0, 255, 0, 255),
        new Color(0, 0, 255, 255),
        new Color(255, 255, 0, 255),
        new Color(255, 0, 255, 255),
        new Color(0, 255, 255, 255),
        new Color(255, 128, 0, 255),
        new Color(255, 0, 128, 255),
    ];

    $('#button-cp-1').click(function() {
        resetPixels();
        // Get skin as mask.
        var skin_mask = getSkinMask(image);

        image = preprocess(image);
        image = process(image, 0.995);
        image = mask(image, skin_mask);

        var blobs = retrieveBlobs(image);

        var i = 0;
        for (var k in blobs) {
            var blob = blobs[k];
            for (var j in blob.clusters) {
                setImgPixelAt(image, blob.clusters[j][0], blob.clusters[j][1], colors[i]);
            }
            i = (i + 1) % colors.length;
        }

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-cp-2').click(function() {
        resetPixels();
        var skin_mask = getSkinMask(image);
        image = medianFilter(image);

        image = negativeHoles(image, skin_mask);

        var blobs = retrieveBlobs(image);

        var i = 0;
        for (var k in blobs) {
            var blob = blobs[k];
            for (var j in blob.clusters) {
                setImgPixelAt(image, blob.clusters[j][0], blob.clusters[j][1], colors[i]);
            }
            i = (i + 1) % colors.length;
        }

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-cp-3').click(function() {
        resetPixels();

        var skin_mask = getSkinMask(image);
        var blobs = retrieveBlobsDual(image, skin_mask);

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);

        markBlob(blobs.edge, "green");
        markBlob(blobs.neg, "red");

        setDirty(canvas2);
    });

    $('#button-cp-4').click(function() {
        resetPixels();

        var skin_mask = getSkinMask(image);
        var blobs = retrieveBlobsDual(image, skin_mask);
        var candidates = findEyesCandidate(blobs);
        var eyes = selectEyes(candidates);
        if ((eyes.left) && (eyes.right)) {
            var cp = {
                eyes: extractEyesCP(eyes),
            }

            canvas2.width = image.width;
            canvas2.height = image.height;
            ctx2.putImageData(image, 0, 0);
    
            markPoints(cp.eyes, "green");
    
            setDirty(canvas2);
        }
    });

    $('#button-cp-5').click(function() {
        resetPixels();

        var skin_mask = getSkinMask(image);
        var blobs = retrieveBlobsDual(image, skin_mask);
        var eyes_candidates = findEyesCandidate(blobs);
        var eyes = selectEyes(eyes_candidates);

        if ((eyes.left) && (eyes.right)) {
            var mouth_candidates = findMouthCandidate(blobs, eyes);
            var mouth = selectMouth(mouth_candidates, eyes);
            var cp = {
                eyes: extractEyesCP(eyes),
                mouth: extractMouthCP(mouth)
            }
            console.log(cp);

            // for (var j in mouth.clusters) {
            //     setImgPixelAt(image, mouth.clusters[j][0], mouth.clusters[j][1], new Color(255, 0, 0, 255));
            // }

            canvas2.width = image.width;
            canvas2.height = image.height;
            ctx2.putImageData(image, 0, 0);

            // markPoints(cp.eyes, "green");
            markPoints(cp.mouth, "green");

            setDirty(canvas2);
        }
    });

    $('#button-cp-6').click(function() {
        resetPixels();

        var skin_mask = getSkinMask(image);
        var blobs = retrieveBlobsDual(image, skin_mask);
        var eyes_candidates = findEyesCandidate(blobs);
        var eyes = selectEyes(eyes_candidates);

        if ((eyes.left) && (eyes.right)) {
            var mouth_candidates = findMouthCandidate(blobs, eyes);
            var mouth = selectMouth(mouth_candidates, eyes);
            var nose_candidates = findNoseCandidate(blobs, eyes, mouth);
            var cp = {
                eyes: extractEyesCP(eyes),
                mouth: extractMouthCP(mouth),
            }
            cp.nose = extractNoseCP(nose_candidates, cp.eyes, cp.mouth);

            canvas2.width = image.width;
            canvas2.height = image.height;
            ctx2.putImageData(image, 0, 0);

            // markPoints(cp.eyes, "green");
            // markPoints(cp.mouth, "green");
            markPoints(cp.nose, "green");

            setDirty(canvas2);
        }
    });

    $('#button-cp-7').click(function() {
        resetPixels();

        var sets = [];

        var v = 0;
        var skin_masks = getSkinMasks(image);
        for (var k in skin_masks) {
            var blobs = retrieveBlobsDual(image, skin_masks[k]);
            var eyes_candidates = findEyesCandidate(blobs);
            var eyes = selectEyes(eyes_candidates);


            if ((eyes.left) && (eyes.right)) {
                var mouth_candidates = findMouthCandidate(blobs, eyes);
                var mouth = selectMouth(mouth_candidates, eyes);
                var nose_candidates = findNoseCandidate(blobs, eyes, mouth);
                var cp = {
                    eyes: extractEyesCP(eyes),
                    mouth: extractMouthCP(mouth),
                }
                cp.nose = extractNoseCP(nose_candidates, cp.eyes, cp.mouth);

                sets.push({
                    eyes: eyes,
                    mouth: mouth,
                    cp: cp
                })
            }
        }

        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);

        for (var k in sets) {
            recognize(ctx2, sets[k].eyes, sets[k].mouth, sets[k].cp);
        }

        setDirty(canvas2);
    });

    var recognize = function(ctx, eyes, mouth, cp) {
        markPoints(cp.eyes, "green");
        markPoints(cp.mouth, "green");
        markPoints(cp.nose, "green");
        
        var b;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.fillStyle = "";
        ctx.strokeStyle = "blue";
        b = new Boundary(
            eyes.left.container.boundary.min.x,
            eyes.right.container.boundary.max.x,
            Math.min(eyes.left.boundary.min.y, eyes.right.boundary.min.y),
            mouth.boundary.max.y
        );
        var o = {
            x: b.getWidth() * 0.1,
            y: b.getHeight() * 0.1
        }
        b.min.x -= o.x;
        b.max.x += o.x;
        b.min.y -= o.y;
        b.max.y += o.y;
        ctx.rect(b.min.x, b.min.y, b.getWidth(), b.getHeight());
        ctx.stroke();
        ctx.closePath();

        var cx = (b.max.x + b.min.x) / 2;
        var cy = b.max.y + o.y;

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.textBaseline = "top"; 
        ctx.textAlign = "center";
        ctx.lineWidth = 1;
        ctx.font = "30px arial";
        var max = null;
        var max_s = 0;
        for (var k in faces) {
            var s = matchFace(faces[k].data, cp);
            console.log(faces[k].name, s);
            if (s > max_s) {
                max = faces[k].name;
                max_s = s;
            }
        }

        if (max != null) {
            var text = max;

            ctx.strokeText(text, cx, cy);
            ctx.fillText(text, cx, cy);
        }
    }

    var faces = [
        {
            name: 'Suhendi',
            data: {"eyes":{"left_tip":{"x":195,"y":99},"left":{"x":212,"y":96.5},"right":{"x":277,"y":100},"right_tip":{"x":296,"y":101}},"mouth":{"left":{"x":211,"y":159},"right":{"x":275,"y":164},"center":{"x":243,"y":156}},"nose":{"left":{"x":234,"y":130.5},"right":{"x":258,"y":131.5}}}
        },
        {
            name: 'Douglas',
            data: {"eyes":{"left_tip":{"x":124,"y":201},"left":{"x":145,"y":196.5},"right":{"x":226,"y":191.5},"right_tip":{"x":245,"y":193}},"mouth":{"left":{"x":159,"y":280},"right":{"x":229,"y":284},"center":{"x":194,"y":282}},"nose":{"left":{"x":165,"y":250.5},"right":{"x":196,"y":250}}}
        },
        {
            name: "James",
            data: {"eyes":{"left_tip":{"x":134,"y":137},"left":{"x":152,"y":135},"right":{"x":217,"y":131.5},"right_tip":{"x":237,"y":133}},"mouth":{"left":{"x":156,"y":208},"right":{"x":221,"y":201},"center":{"x":189,"y":202}},"nose":{"left":{"x":175,"y":175.5},"right":null}}
        }
    ];

    var matchFace = function(face, cp) {
        // Distance between eyes.
        var df = (face.eyes.right_tip.x - face.eyes.left_tip.x);
        var fc = (face.eyes.left_tip.x + df) / 2;
        var dc = (cp.eyes.right_tip.x - cp.eyes.left_tip.x);
        var score_e = ((fc - face.eyes.left_tip.x) + (face.eyes.right_tip.x - fc)) / dc;
        score_e = 1 - Math.tanh(Math.abs(score_e - 1));

        // Y position of the eyes.
        var fey = ((face.mouth.left.y + face.mouth.right.y) / 2);
        var cey = ((cp.mouth.left.y + cp.mouth.right.y) / 2);

        // Y position of the mouth.
        var fmy = ((face.eyes.right_tip.y + face.eyes.left_tip.y) / 2);
        var cmy = ((cp.eyes.right_tip.y + cp.eyes.left_tip.y) / 2);

        // Width of the face.
        var dfw = face.eyes.right_tip.x - face.eyes.left_tip.x;
        var dcw = cp.eyes.right_tip.x - cp.eyes.left_tip.x;

        // Height of the face.
        var dfh = fey - fmy;
        var dch = cey - cmy;
        
        // Score the face ratio.

        var score_m = 1 - Math.abs((dfh / dfw) - (dch / dcw));

        // var score_m = Math.abs(1 - Math.abs(dfh - dch) / dfh);

        score_m = 1 - Math.tanh(Math.abs(score_m - 1));

        // Position of nose relative to eyes and mouth.

        var fny;
        var cny;

        var score_n = 0.5;

        if ((face.nose.left) && (face.nose.right)) {
            fny = (face.nose.left.y + face.nose.right.y) / 2;
        } else {
            fny = (face.nose.left || face.nose.right).y;
        }

        if ((cp.nose.left) && (cp.nose.right)) {
            cny = (cp.nose.left.y + cp.nose.right.y) / 2;
        } else {
            cny = (cp.nose.left || cp.nose.right);
            if (cny) {
                cny = cny.y;
            }
        }

        if (cny) {
            score_n = 1 - Math.abs(((fny - fey) / dfh) - ((cny - cey) / dch));
            score_n = 1 - Math.tanh(Math.abs(score_n - 1));
        }

        var metrics = [score_e, score_m, score_n]
        // var score = metrics.reduce((a, b) => a * b);
        var score = metrics.reduce((a, b) => a + b) / metrics.length;
        return score;
    }

});