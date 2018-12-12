var util = (function() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var identity = [
        [0, 0]
    ];

    var neighbours4 = [
        [0, -1],
        [-1, 0],
        [1, 0],
        [0, 1],
    ];

    var neighbours5 = [
        [0, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [0, 1],
    ];

    var neighbours8 = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
    ];
    
    var neighbours9 = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1]
    ];

    var createNeighboursMask = function(size) {
        var neighbours = [];
        for (var y = -size; y <= size; y++) {
            for (var x = -size; x <= size; x++) {
                neighbours.push([x, y]);
            }
        }
        return neighbours;
    }

    var createRoundNeighboursMask = function(size) {
        var neighbours = [];
        for (var y = -size; y <= size; y++) {
            for (var x = -size; x <= size; x++) {
                if (Math.sqrt((x * x) + (y * y)) <= size) {
                    neighbours.push([x, y]);
                }
            }
        }
        return neighbours;
    }
    
    var inBound = function(obj, x, y) {
        return (x >= 0) && (x < obj.width) && (y >= 0) && (y < obj.height);
    }

    var empty = function(c) {
        return c.getBrightness() == 0;
    }

    var countNeighbours = function(img, x, y, neighbours=neighbours8) {
        var c = 0;
        for (var i = 0; i < neighbours.length; i++) {
            var dx = x + neighbours[i][0];
            var dy = y + neighbours[i][1];
            if (inBound(img, dx, dy)) {
                if (!empty(getImgPixelAt(img, dx, dy))) {
                    c++;
                }
            }
        }
        return c;
    }
    
    var getNeighbours = function(img, x, y, neighbours=neighbours8) {
        var c = [];
        for (var i = 0; i < neighbours.length; i++) {
            var dx = x + neighbours[i][0];
            var dy = y + neighbours[i][1];
            if (inBound(img, dx, dy)) {
                var n = getImgPixelAt(img, dx, dy);
                if (!empty(n)) {
                    c.push(n)
                }
            }
        }
        return c;
    }

    var removeDot = function(img, threshold=0) {
        var newimg = ctx.createImageData(img.width, img.height);
        newimg.data.set(img.data);
        var i = 0;
        var changes = [];
        for (var y = 0; y < img.height; y++) {
            for (var x = 0; x < img.width; x++) {
                var c = getImgPixelAt(img, x, y);
                if (!empty(c)) {
                    if (countNeighbours(img, x, y) <= threshold) {
                        changes.push(i);
                    }
                }
                i += 4;
            }
        }
        for (var j = 0; j < changes.length; j++) {
            i = changes[j];
            newimg.data[i] = 0;
            newimg.data[i + 1] = 0;
            newimg.data[i + 2] = 0;
        }
        return {
            result: newimg,
            counts: changes.length,
        };
    }
    
    var fillDot = function(img, threshold=4) {
        var newimg = ctx.createImageData(img.width, img.height);
        newimg.data.set(img.data);
        var i = 0;
        var changes = [];
        for (var y = 0; y < img.height; y++) {
            for (var x = 0; x < img.width; x++) {
                var c = getImgPixelAt(img, x, y);
                if (empty(c)) {
                    if (countNeighbours(img, x, y) >= threshold) {
                        changes.push(i);
                    }
                }
                i += 4;
            }
        }
        for (var j = 0; j < changes.length; j++) {
            i = changes[j];
            newimg.data[i] = 255;
            newimg.data[i + 1] = 255;
            newimg.data[i + 2] = 255;
        }
        return {
            result: newimg,
            counts: changes.length,
        };
    }

    return {
        empty: empty,
        removeDot: removeDot,
        fillDot: fillDot,
        neighbours: {
            four: neighbours4,
            five: neighbours5,
            eight: neighbours8,
            nine: neighbours9,
            square: createNeighboursMask,
            circle: createRoundNeighboursMask,
            identity: identity,
        },
        countNeighbours: countNeighbours,
        getNeighbours: getNeighbours,
        inBound: inBound
    }
})();

util.image = (function() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var clear = function(img, clearColor = new Color(0, 0, 0, 255)) {
        for (var i = 0; i < img.data.length; i += 4) {
            img.data[i] = clearColor.r;
            img.data[i + 1] = clearColor.g;
            img.data[i + 2] = clearColor.b;
            img.data[i + 3] = clearColor.a;
        }
        return img;
    }

    var copy = function(img) {
        var nimg = ctx.createImageData(img.width, img.height);
        for (var i in img.data) {
            nimg.data[i] = img.data[i];
        }
        return nimg;
    }

    var over = function(src, dst) {
        var a = src.a / 255;
        var ma = 1 - a;
        return new Color(src.r + dst.r * ma, src.g + dst.g * ma, src.b + dst.b * ma, src.a + dst.a * ma);
    }

    var blend = function(top, bottom, blendFunc=over, resizeAlgo=sampler.sampler.bilinear) {
        if ((top.width != bottom.width) || (top.height != bottom.height)) {
            top = sampler.resize(top, bottom.width, bottom.height, resizeAlgo);
        }
        var img = ctx.createImageData(bottom.width, bottom.height);
        for (var i = 0; i < bottom.data.length; i += 4) {
            var c = blendFunc(
                new Color(top.data[i], top.data[i + 1], top.data[i + 2], top.data[i + 3]),
                new Color(bottom.data[i], bottom.data[i + 1], bottom.data[i + 2], bottom.data[i + 3])
            )
            img.data[i] = c.r;
            img.data[i + 1] = c.g;
            img.data[i + 2] = c.b;
            img.data[i + 3] = c.a;
        }
        return img;
    }

    return {
        blend: blend,
        blendFunc: {
            over: over
        },
        clear: clear,
        copy: copy
    }
})();

util.misc = (function() {
    var reduce = function(list, func) {
        if ((Array.isArray(list)) && (list.length > 0)) {
            var curr = list[0];
            for (var i = 1; i < list.length; i++) {
                curr = func(curr, list[i]);
            }
            return curr;
        }
        return null;
    }

    return {
        reduce: reduce
    }
})();