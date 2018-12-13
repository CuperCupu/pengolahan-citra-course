var density = (function() {

    class DensityMap {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.min = Number.MAX_SAFE_INTEGER;
            this.max = Number.MIN_SAFE_INTEGER;
            this.data = new Array(this.width * this.height);
            for (var i = 0; i < this.data.length; i++) {
                this.data[i] = 0;
            }
        }

        normalize() {
            var min = this.getMinDensity();
            var max = this.getMaxDensity();
            var delta = max - min;
            for (var i = 0; i < this.data.length; i++) {
                this.data[i] = (this.data[i] - min) / delta;
            }
        }

        map(func) {
            for (var i = 0; i < this.data.length; i++) {
                this.data[i] = func(this.data[i]);
            }
        }

        propagate(count=1, neighbours=util.neighbours.eight, cb=null) {
            if (count > 0) {
                var changes = new Array(this.width * this.height);
                var c = 0;
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        changes[c] = 0;
                        for (var i = 0; i < neighbours.length; i++) {
                            var dx = x + neighbours[i][0];
                            var dy = y + neighbours[i][1];
                            if (util.inBound(this, dx, dy)) {
                                changes[c] += this.getAt(dx, dy);
                            }
                        }
                        c++;
                    }
                }
                for (var i = 0; i < c; i++) {
                    this.data[i] += changes[i];
                }
                if (cb) {
                    cb(this, count);
                }
                this.propagate(count - 1);
            }
        }
        
        regenerate(neighbours=util.neighbours.nine) {
            var changes = new Array(this.width * this.height);
            var c = 0;
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    changes[c] = 0;
                    for (var i = 0; i < neighbours.length; i++) {
                        var dx = x + neighbours[i][0];
                        var dy = y + neighbours[i][1];
                        if (util.inBound(this, dx, dy)) {
                            changes[c] += this.getAt(dx, dy);
                        }
                    }
                    c++;
                }
            }
            for (var i = 0; i < c; i++) {
                this.data[i] = changes[i];
            }
        }

        /**
         * Reduce all density value in this map.
         * @param {Number} count The number of count to reduce from density.
         */
        reduce(count) {
            for (var i = 0; i < this.data.length; i++) {
                var v = this.data[i] - count;
                if (v < 0) {
                    v = 0;
                }
                this.data[i] = v;
            }
        }

        setAt(x, y, val) {
            this.data[y * this.width + x] = val;
        }

        getAt(x, y) {
            return this.data[y * this.width + x];
        }

        getMinDensity() {
            var min = Number.MAX_VALUE;
            for (var i = 0; i < this.data.length; i++) {
                if (min > this.data[i]) {
                    min = this.data[i];
                }
            }
            return min;
        }
        
        getMaxDensity() {
            var max = Number.MIN_VALUE;
            for (var i = 0; i < this.data.length; i++) {
                if (max < this.data[i]) {
                    max = this.data[i];
                }
            }
            return max;
        }

        getAverage() {
            var total = 0;
            var counts = 0;
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i] > 0) {
                    total += this.data[i];
                    counts++;
                }
            }
            if (counts > 0) {
                return total / counts;
            }
            return 0;
        }

        mult(map) {
            return this.operate(map, (l, r) => {return l * r});
        }

        add(map) {
            return this.operate(map, (l, r) => {return l + r});
        }

        sub(map) {
            return this.operate(map, (l, r) => {
                var t = l - r;
                return t < 0 ? 0 : t;
            });
        }

        operate(map, func) {
            if ((map.width == this.width) && (map.height == this.height)) {
                for (var i = 0; i < this.data.length; i++) {
                    this.data[i] = func(this.data[i], map.data[i]);
                }
                return this;
            } else {
                throw Error("Mismatch dimension.");
            }
        }

        inBound(x, y) {
            return (x >= 0) && (x < this.width) && (y >= 0) && (y < this.height);
        }
    }

    var createDensityMap = function(img, neighbours=util.neighbours.nine) {
        var map = new DensityMap(img.width, img.height);
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                var n = util.getNeighbours(img, x, y, neighbours);
                var intensity = 0;
                for (var i = 0; i < n.length; i++) {
                    intensity += n[i].getBrightness();
                }
                map.setAt(x, y, intensity);
            }
        }
        return map;
    }

    var copyMap = function(map) {
        var copy = new DensityMap(map.width, map.height);
        for (var i = 0; i < copy.data.length; i++) {
            copy.data[i] = map.data[i];
        }
        return copy;
    }

    return {
        DensityMap: DensityMap,
        createDensityMap: createDensityMap,
        copy: copyMap
    }
})();

density.visualizer = (function() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var gradient = function(info, params) {
        var c;
        if (info.val >= params.cutoff) {
            var d = (info.val - info.min) / info.delta;
            c = sampler.interpolate(params.low, params.high, d);
        } else {
            c = params.off;
        }
        return c;
    }

    var binary = function(info, params) {
        var c;
        if (info.val >= params.cutoff) {
            c = params.high;
        } else {
            c = params.low;
        }
        return c;
    }

    var visualize = function(map, func, params) {
        var img = ctx.createImageData(map.width, map.height);
        var min = map.getMinDensity();
        var max = map.getMaxDensity();
        var delta = max - min;
        var info = {
            min: min,
            max: max,
            delta: delta,
        }
        var i = 0;
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                info.val = map.getAt(x, y);
                var c = func(info, params);
                img.data[i] = c.r;
                img.data[i + 1] = c.g;
                img.data[i + 2] = c.b;
                img.data[i + 3] = c.a;
                i += 4;
            }
        }
        return img;
    }

    var mark = function(map, func, params) {
        var newimg = ctx.createImageData(map.width, map.height);
        var min = params.min;
        var max = params.max;
        var delta = max - min;
        var info = {
            min: min,
            max: max,
            delta: delta,
        }
        var i = 0;
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                info.val = map.getAt(x, y);
                if ((info.val >= min) && (info.val <= max)) {
                    var c = func(info, params);
                    newimg.data[i] = c.r;
                    newimg.data[i + 1] = c.g;
                    newimg.data[i + 2] = c.b;
                    newimg.data[i + 3] = c.a;
                } else {
                    newimg.data[i] = 0;
                    newimg.data[i + 1] = 0;
                    newimg.data[i + 2] = 0;
                    newimg.data[i + 3] = 0;
                }
                i += 4;
            }
        }
        return newimg
    }

    return {
        visualize: visualize,
        mark: mark,
        cm: {
            gradient: gradient,
            binary: binary,
        }
    }
})();

density.mask = (function() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    /**
     * @param {density.DensityMap} map 
     * @param {ImageData} image 
     * @returns {ImageData}
     */
    var maskImage = function(map, image) {
        if ((map.width == image.width) && (map.height == image.height)) {
            var img = ctx.createImageData(map.width, map.height);
            var i = 0;
            for (var y = 0; y < map.height; y++) {
                for (var x = 0; x < map.width; x++) {
                    var d = map.getAt(x, y);
                    img.data[i] = d * image.data[i];
                    img.data[i + 1] = d * image.data[i + 1];
                    img.data[i + 2] = d * image.data[i + 2];
                    img.data[i + 3] = image.data[i + 3];
                    i += 4;
                }
            }
            return img;
        } else {
            throw Error("Mismatch between map and image dimension.");
        }
    }

    return {
        image: maskImage
    }
})();

density.blobs = (function() {
    
    var labelBlob = function(map) {
        var blobs = new density.DensityMap(map.width, map.height);
        var neighbours = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0]
        ];
        var l = 1;
        var labelTable = {};
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                var v = map.getAt(x, y);
                if (v > 0) {
                    var sum = 0;
                    var num = Number.MAX_VALUE;
                    var fores = [[x, y]];
                    for (var i = 0; i < neighbours.length; i++) {
                        var dx = x + neighbours[i][0];
                        var dy = y + neighbours[i][1];
                        if (map.inBound(dx, dy)) {
                            var d = blobs.getAt(dx, dy);
                            if (d > 0) {
                                sum += d;
                                if (labelTable[d] < num) {
                                    num = labelTable[d];
                                }
                                fores.push([dx, dy]);
                            }
                        }
                    }
                    if (sum == 0) {
                        labelTable[l] = l;
                        blobs.setAt(x, y, l++);
                    } else {
                        blobs.setAt(x, y, num);
                        for (var i = 0; i < fores.length; i++) {
                            var n = blobs.getAt(fores[i][0], fores[i][1]);
                            // blobs.setAt(fores[i][0], fores[i][1], num);
                            if ((n > 0) && (n != num)) {
                                if (labelTable[n] > num) {
                                    labelTable[n] = num;
                                } else if (labelTable[n] < num) {
                                    labelTable[num] = labelTable[n];
                                }
                            }
                        }
                    }
                }
            }
        }
        // Reduces the label table.
        var diff;
        do {
            diff = 0;
            for (var k in labelTable) {
                var d = labelTable[k];
                var t = labelTable[d];
                if (d != t) {
                    diff++;
                    labelTable[k] = t;
                }
            }
        } while (diff > 0);
        // Normalize the label.
        // var normal = [];
        // for (var k in labelTable) {
        //     var v = parseInt(labelTable[k]);
        //     if (normal.indexOf(v) == -1) {
        //         normal.push(v);
        //     }
        // }
        // normal.sort((a, b) => { return a - b});
        // var maps = {};
        // for (var i = 0; i < normal.length; i++) {
        //     maps[normal[i]] = parseInt(i + 1);
        // }
        // for (var k in labelTable) {
        //     var d = labelTable[k];
        //     labelTable[k] = maps[d];
        // }
        labelTable[0] = 0;
        blobs.map((e) => {return labelTable[e]});
        blobs.min = blobs.getMinDensity();
        blobs.max = blobs.getMaxDensity();
        return blobs;
    }

    var retrieveBlobs = function(blobs) {
        var objects = {};
        var avgs = {};
        for (var y = 0; y < blobs.height; y++) {
            for (var x = 0; x < blobs.width; x++) {
                var d = blobs.getAt(x, y);
                if (d > 0) {
                    var obj;
                    if (!(d in objects)) {
                        obj = objects[d] = {
                            clusters: [],
                            boundary: new Boundary(
                                Number.POSITIVE_INFINITY,
                                Number.NEGATIVE_INFINITY,
                                Number.POSITIVE_INFINITY,
                                Number.NEGATIVE_INFINITY,
                            ),
                            center: {
                                x: 0,
                                y: 0
                            },
                            counts: 0
                        }
                    } else {
                        obj = objects[d];
                        avg = avgs[d];
                    }
                    if (x < obj.boundary.min.x) {
                        obj.boundary.min.x = x;
                    }
                    if (x > obj.boundary.max.x) {
                        obj.boundary.max.x = x;
                    }
                    if (y < obj.boundary.min.y) {
                        obj.boundary.min.y = y;
                    }
                    if (y > obj.boundary.max.y) {
                        obj.boundary.max.y = y;
                    }
                    obj.center.x += x;
                    obj.center.y += y;
                    obj.counts++;
                    obj.clusters.push([x, y]);
                }
            }
        }
        for (var k in objects) {
            var obj = objects[k];
            obj.center.x /= obj.counts;
            obj.center.y /= obj.counts;
            obj.size = {
                width: obj.boundary.max.x - obj.boundary.min.x + 1,
                height: obj.boundary.max.y - obj.boundary.min.y + 1
            }
            obj.density = obj.counts / (obj.size.width * obj.size.height);
            obj.ratio = obj.size.height / obj.size.width;
        }
        return objects;
    }

    var selectLargest = function(img, blobs, clearColor = new Color(0, 0, 0, 255)) {
        var max = 0;
        var i = null;
        for (var k in blobs) {
            if (blobs[k].counts > max) {
                i = k;
                max = blobs[k].counts;
            }
        }
        for (var k in blobs) {
            if (k != i) {
                var b = blobs[k];
                fillBlob(img, b, clearColor);
            }
        }
        return blobs[i];
    }

    var removeNoise = function(img, blobs, threshold, clearColor = new Color(0, 0, 0, 255)) {
        var bArray = [];
        for (var k in blobs) {
            bArray.push(blobs[k]);
        }
        bArray.sort((a, b) => { return a.counts - b.counts });
        // var range = bArray[0].counts - bArray[bArray.length - 1].counts;
        threshold = (1 - threshold) * bArray[bArray.length - 1].counts;
        var idx = -1;
        for (var i = 0; i < bArray.length; i++) {
            if (bArray[i].counts < threshold) {
                idx = i;
            }
        }
        if (idx > -1) {
            for (var j = 0; j < idx; j++) {
                var b = bArray[j];
                fillBlob(img, b, clearColor);
            }
            bArray.splice(0, idx + 1);
        }
        return bArray;
    }

    var toMap = function(blob) {
        var map = new DensityMap(blob.size.width, blob.size.height);
        // Fill with 0.
        map.map((e) => 0);
        for (var i = 0; i < blob.clusters.length; i++) {
            var p = blob.clusters[i];
            p[0] -= map.boundary.min.x;
            p[1] -= map.boundary.min.y;
            map.setAt(p[0], p[1], 1);
        }
        return map;
    }

    var fillBlob = function(img, blob, fill) {
        for (var k in blob.clusters) {
            var p = blob.clusters[k];
            setImgPixelAt(img, p[0], p[1], fill);
        }
        return img;
    }

    var mergeBlob = function(b1, b2) {
        var b = {
            clusters: [],
            boundary: new Boundary(
                Math.min(b1.boundary.min.x, b2.boundary.min.x), 
                Math.max(b1.boundary.max.x, b2.boundary.max.x),
                Math.min(b1.boundary.min.y, b2.boundary.min.y),
                Math.max(b1.boundary.max.y, b2.boundary.max.y),
            ),
            center: {
                x: (b1.center.x + b2.center.x) / 2,
                y: (b1.center.y + b2.center.y) / 2
            },
            counts: b1.counts + b2.counts,
        }
        for (var i = 0; i < b1.clusters.length; i++) {
            b.clusters.push(b1.clusters[i]);
        }
        for (var i = 0; i < b2.clusters.length; i++) {
            b.clusters.push(b2.clusters[i]);
        }
        b.size = {
            width: b.boundary.max.x - b.boundary.min.x + 1,
            height: b.boundary.max.y - b.boundary.min.y + 1
        }
        b.density = b.counts / (b.size.width * b.size.height);
        b.ratio = b.size.height / b.size.width;
        return b;
    }

    return {
        label: labelBlob,
        retrieve: retrieveBlobs,
        selectLargest: selectLargest,
        toMap: toMap,
        removeNoise: removeNoise,
        fill: fillBlob,
        merge: mergeBlob
    }
})();

density.filler = (function() {

    var n = util.neighbours.four;

    /**
     * @param {DensityMap} map 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} fill 
     */
    var floodFill = function(map_original, x, y, fill = 1) {
        var map = density.copy(map_original);
        var queue = [[x, y]];
        while (queue.length > 0) {
            var curr = queue.pop();
            if (map.getAt(curr[0], curr[1]) == 0) {
                map.setAt(curr[0], curr[1], fill);
                for (var k in n) {
                    var dx = curr[0] + n[k][0];
                    var dy = curr[1] + n[k][1];
                    if (map.inBound(dx, dy)) {
                        if (map.getAt(dx, dy) == 0) {
                            queue.unshift([dx, dy]);
                        }
                    }
                }
            }
        }
        return map;
    }

    return {
        fill: floodFill
    }

})();