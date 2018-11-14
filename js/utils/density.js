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

    return {
        DensityMap: DensityMap,
        createDensityMap: createDensityMap,
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
            c = params.low;
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