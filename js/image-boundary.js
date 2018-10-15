
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Color {
    constructor(r, g, b, a=255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    getBrightness() {
        return (this.r + this.g + this.b) / 3;
    }
}

class ChainCode {
    constructor(code = "") {
        this.code = code;
        this.length = code.length;
    }

    addCode(code) {
        this.code += code;
        this.length++;
    }

    toString() {
        return this.code;
    }

    getAt(x) {
        var index = Math.round(x * this.length);
        if (index === this.length) {
            index--;
        }
        return this.code[index];
    }

    match(other) {
        var min, max = null;
        if (this.length > other.length) {
            max = this;
            min = other;
        } else {
            max = other;
            min = this;
        }
        // Compare higher to lower.
        var length1 = max.length;
        var error1 = 0;
        for (var i = 0; i < length1; i++) {
            // error += max.code[i] !== min.getAt(i / length) ? 1 : 0;
            var diff = getDirDiff(max.code[i], min.getAt(i / length1));
            // console.log(max.code[i], min.getAt(i / length), diff);
            error1 += diff <= 1 ? 0 : 1;
            // error1 += diff;
        }
        // Compare lower to higher.
        var length2 = min.length;
        var error2 = 0;
        for (var i = 0; i < length2; i++) {
            // error += max.code[i] !== min.getAt(i / length) ? 1 : 0;
            var diff = getDirDiff(min.code[i], max.getAt(i / length2));
            // console.log(max.code[i], min.getAt(i / length), diff);
            error2 += diff <= 1 ? 0 : 1;
            // error2 += diff;
        }
        error1 = error1 / length1;
        error2 = error2 / length2;
        return (error1 + error2) / 2;
    }
}


var getOffset = function(dir) {
    if (dir == 0) {
        return new Point(0, 0);
    } else if (dir == 1) { // Right
        return new Point(1, 0);
    } else if (dir == 2) { // Up-Right
        return new Point(1, -1);
    } else if (dir == 3) { // Up
        return new Point(0, -1);
    } else if (dir == 4) { // Up-Left
        return new Point(-1, -1);
    } else if (dir == 5) { // Left
        return new Point(-1, 0);
    } else if (dir == 6) { // Down-Left
        return new Point(-1, 1);
    } else if (dir == 7) { // Down
        return new Point(0, 1);
    } else if (dir == 8) { // Down-Right
        return new Point(1, 1);
    }
    return null;
}

var getSide = function(dir) {
    var off = getOffset(dir);
    return new Point(-off.y, off.x);
}

var offsetDir = function(dir, off) {
    dir += off;
    if (dir > 8) {
        dir = 1;
    } else if (dir < 1) {
        dir = 8;
    }
    return dir;
}

var getDirDiff = function(dir1, dir2) {
    return Math.min(Math.abs(dir1 - dir2), 8 - Math.abs(dir1 - dir2));
}

var nextDir = function(dir) {
    return offsetDir(dir, 1);
}

var prevDir = function(dir) {
    return offsetDir(dir, -1);
}

var findNonEmpty = function(img) {
    let x = 0;
    let y = 0;
    let found = false;
    while ((!found) && ((x < img.width) && (y < img.height))) {
        found = getImgPixelAt(img, x, y).r > 0;
        if (!found) {
            x += 1;
            if (x >= img.width) {
                x = 0;
                y += 1;
            }
        }
    }
    if (found) {
        return {
            x: x,
            y: y
        }
    }
    return null;
}

function findBoundary(img) {
    try {
        var result = new ChainCode();
        var x, y, sx, sy = 0;
        var dir = 1;
        var pos = findNonEmpty(img);
        if (pos != null) {
            sx = x = pos.x;
            sy = y = pos.y;
            var iter = 0;
            var max_iter = img.data.length / 4;
            var trace = []
            var opaque = false;
            do {
                opaque = false;
                var it = 0;
                dir = offsetDir(dir, 2);
                while ((!opaque) && (it < 8)) {
                    var off = getOffset(dir);
                    var color = getImgPixelAt(img, x + off.x, y + off.y);
                    opaque = color == null ? false: color.r > 0;
                    if (!opaque) {
                        it++;
                        dir = prevDir(dir);
                    } else {
                        result.addCode(dir);
                        trace.push(new Point(x, y));
                        x += off.x;
                        y += off.y;
                    }
                }
                iter++;
            } while (((x != sx) || (y != sy)) && (opaque) && (iter < max_iter));
            // for (var i = 0; i < trace.length; i++) {
            //     setImgPixelAt(img, trace[i].x, trace[i].y, new Color(255, 0, 0, 255));
            // }
            // setImgPixelAt(img, sx, sy, new Color(0, 255, 0, 255));
            // ctx.mozImageSmoothingEnabled = false;
            // ctx.webkitImageSmoothingEnabled = false;
            // ctx.msImageSmoothingEnabled = false;
            // ctx.imageSmoothingEnabled = false;
            return {
                "start": new Point(sx, sy),
                "code": result,
                "trace": trace
            };
        }
        return null;
    } catch(err) {
        alert("boundary: " + err);
    }
}