
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

    get(i) {
        return parseInt(this.code[i]);
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

function endPointDirection(x, y, image) {
    var dir = 0;
    var i = 1;
    while (i < 9) {
        var off = getOffset(i);
        var c = getImgPixelAt(image, x + off.x, y + off.y);
        if (c.r > 0) {
            dir = i;
            i = 9;
        }
        i++;
    }
    
    return offsetDir(dir, 4);
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
        dir -= 8;
    } else if (dir < 1) {
        dir += 8;
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
        var p = findEndPoints(img);
        if (p.length > 0) {
            var pos = p[0];
            var dir = offsetDir(endPointDirection(pos.x, pos.y, img), 2);
        } else {
            var pos = findNonEmpty(img);
        }
        var min = {
            x: img.width,
            y: img.height
        }
        var max = {
            x: 0,
            y: 0
        }
        if (pos != null) {
            sx = x = pos.x;
            sy = y = pos.y;
            var iter = 0;
            var max_iter = img.data.length / 4;
            var trace = []
            var opaque = false;
            do {
                if (x < min.x) {
                    min.x = x;
                }
                if (x > max.x) {
                    max.x = x;
                }
                if (y < min.y) {
                    min.y = y;
                }
                if (y > max.y) {
                    max.y = y;
                }
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
                "trace": trace,
                "boundary": {
                    min: min,
                    max: max
                },
                "size": {
                    width: max.x - min.x,
                    height: max.y - min.y
                }
            };
        }
        return null;
    } catch(err) {
        alert("boundary: " + err);
    }
}

function findTurningPointsFromChainCode(code, threshold=0.025) {
    let length = code.length;
    threshold = Math.round(length * threshold);
    // Find end points and shift the code.
    let i = 0;
    let found = false;
    while ((!found) && (i < length - 1)) {
        let delta = getDirDiff(code.get(i + 1), code.get(i));
        if (delta == 4) {
            found = true;
        }
        i++;
    }
    let ncode = code;
    // If found then shift the code.
    if (found) {
        ncode = new ChainCode();
        for (let j = i; j < length; j++) {
            ncode.addCode(code.get(j));
        }
        for (let j = 0; j < i; j++) {
            ncode.addCode(code.get(j));
        }
    } else {
        i = -1;
    }
    // Find turning points.
    let turningPoints = [];
    let slice = i;
    let suspicious = false;
    let last_deltas = [];
    let avg = function(vals) {
        if (vals.length > 0) {
            let total = 0;
            for (var i in vals) {
                total += vals[i];
            }
            return total / vals.length;
        } else {
            return 0;
        }
    }
    i = 0;
    let turning_delta = 0;
    let turning_point = 0;
    let s = [];
    while (i < length - 1) {
        let delta = getDirDiff(ncode.get(i), ncode.get(i + 1));
        if (last_deltas.length >= threshold) {
            let last_delta = avg(last_deltas);
            if (suspicious) {
                if (Math.abs(turning_delta - last_delta) > 1) {
                    suspicious = false;
                    turningPoints.push(turning_point);
                    last_deltas = [];
                }
            } else {
                let d = Math.abs(delta - last_delta);
                if (d == 4) {
                    last_deltas = [];
                } else if (d > 1) {
                    suspicious = true;
                    s.push(i + 1);
                    turning_delta = last_delta;
                    turning_point = i + 1;
                    last_deltas = [];
                } else {
                    last_deltas.splice(0, 1);
                }
            }
        } else {
            if (suspicious) {
                let last_delta = avg(last_deltas);
                if (Math.abs(delta - last_delta) >= 1) {
                    s.push(i + 1);
                    turning_delta = last_delta;
                    turning_point = i + 1;
                    last_deltas.splice(0, 1);
                }
            }
        }
        last_deltas.push(delta);
        i++;
    }
    return {
        turningPoints: turningPoints,
        suspicious: s,
        sliced: slice
    };
}

function findTurningPointsFromTrace(boundary, threshold=0.03) {
    let trace = boundary.trace;
    let code = boundary.code;
    let length = trace.length;
    threshold = Math.round(boundary.size.height * threshold);
    // Find end points and shift the code.
    let i = 0;
    let found = false;
    while ((!found) && (i < length - 1)) {
        let delta = getDirDiff(code.get(i + 1), code.get(i));
        if (delta == 4) {
            found = true;
        }
        i++;
    }
    // If found then shift the code.
    if (found) {
        trace = trace.slice(i).concat(trace.slice(0, i + threshold * 2));
    } else {
        trace = trace.slice(0).concat(trace.slice(0, i + threshold * 2));
        i = -1;
    }
    length = trace.length;
    // Find turning points.
    let turningPoints = [];
    let slice = i;
    let suspicious = false;
    
    var angleBetween = function(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) / Math.PI * 180;
    }
    var angleDelta = function(a1, a2) {
        return Math.min(Math.abs(a1 - a2), 360 - Math.abs(a1 - a2));
    }
    i = 1;
    let last = i;
    let turning_delta = 0;
    let turning_pos = 0;
    let s = [];
    while (i < length - 1) {
        let delta = angleBetween(trace[i], trace[i+1]);
        let b_delta = angleBetween(trace[i-1], trace[i]);
        let l_delta = angleBetween(trace[last], trace[i]);
        let lt_delta = angleBetween(trace[last], trace[i+1]);
        let a_delta = angleDelta(l_delta, delta);
        let ab_delta = angleDelta(b_delta, delta);
        if (ab_delta < 180) {
            if (a_delta > 45) {
                // A turn.
                if (suspicious) {
                    if (i - turning_pos > threshold) {
                        suspicious = false;
                        last = i;
                        s.push(i);
                    }
                    // turning_delta = l_delta;
                    // turning_pos = i;
                } else {
                    if (i - last > threshold) {
                        suspicious = true;
                        turning_delta = l_delta;
                        turning_pos = i;
                        last = i;
                        s.push(i);
                    } else if (a_delta > 90) {
                        last = i;
                    }
                }
            } else {
                if (i - last > threshold) {
                    if (suspicious) {
                        // let t_delta = angleBetween(trace[turning_pos], trace[i]);
                        let ta_delta = angleDelta(turning_delta, l_delta);
                        if ((ta_delta > 45) && (ta_delta < 180)) {
                            turningPoints.push(turning_pos);
                        }
                        suspicious = false;
                    }
                    last = i - threshold;
                } else {
                    if (suspicious) {
                        if (angleDelta(a_delta, turning_delta) < 30) {

                        }
                    }
                }
            }
        } else {
            suspicious = false;
            last = i;
        }
        i++;
    }
    let changed = false;
    do {
        changed = false;
        let i = 0;
        while ((!changed) && (i < turningPoints.length)) {
            let j = 0;
            while ((!changed) && (j < turningPoints.length)) {
                if ((i != j)) {
                    let dist = distanceBetween(trace[turningPoints[i]], trace[turningPoints[j]]);
                    if (dist < threshold) {
                        turningPoints.splice(j, 1);
                        changed = true;
                    }
                }
                j++;
            }
            i++;
        }
    } while (changed);
    return {
        turningPoints: turningPoints,
        suspicious: s,
        sliced: slice
    };
}


function findTurningPointsFromTrace2(boundary, threshold=0.1) {
    let trace = boundary.trace;
    let code = boundary.code;
    let length = trace.length;
    threshold = Math.round(boundary.size.height * threshold);
    // Find end points and shift the code.
    let i = 0;
    let found = false;
    while ((!found) && (i < length - 1)) {
        let delta = getDirDiff(code.get(i + 1), code.get(i));
        if (delta == 4) {
            found = true;
        }
        i++;
    }
    // If found then shift the code.
    if (found) {
        trace = trace.slice(i).concat(trace.slice(0, i));
    } else {
        trace = trace.slice().concat(trace.slice(0, i + threshold));
        i = -1;
    }
    length = trace.length;
    // Find turning points.
    let turningPoints = [];
    let slice = i;
    let tail = 0
    let shiftHead = function() {
        head = tail + 1;
        while ((head < tail + threshold) && (head < length - 1)) {
            let n = trace[head + 1];
            let p = trace[head - 1];
            if ((n.x == p.x) && (n.y == p.y)) {
                tail = head;
            }
            head++;
        }
    }
    let head = tail + threshold;
    let s = []
    while (head < length - 1) {
        let r_dist = realDistanceBetween(trace[tail], trace[head], trace);
        // let r_dist = threshold;
        let dist = distanceBetween(trace[tail], trace[head]);
        let ratio = r_dist / dist;
        if ((ratio > 1.14) && (ratio < 2)) {
            let j = Math.round((head - tail) * (0.77)) + tail;
            turningPoints.push(j);
            tail = j + 1;
            shiftHead();
        } else {
            let n = trace[head + 1];
            let p = trace[head - 1];
            if ((n.x == p.x) && (n.y == p.y)) {
                tail = head;
                shiftHead();
            } else {
                head++;
                tail++;
            }
        }
    }

    let changed = false;
    do {
        changed = false;
        let i = 0;
        while ((!changed) && (i < turningPoints.length)) {
            let j = 0;
            while ((!changed) && (j < turningPoints.length)) {
                if ((i != j)) {
                    let dist = distanceBetween(trace[turningPoints[i]], trace[turningPoints[j]]);
                    if (dist < threshold * 2) {
                        turningPoints.splice(j, 1);
                        changed = true;
                    }
                }
                j++;
            }
            i++;
        }
    } while (changed);
    return {
        turningPoints: turningPoints,
        suspicious: s,
        sliced: slice
    };
}

function distanceBetween(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    return Math.sqrt((dx * dx) + (dy * dy));
}

let distBetweenIndex = function(i1, i2, traces) {
    let dist = 0;
    if (i1 > i2) {
        let t = i1;
        i1 = i2;
        i2 = t;
    }
    for (let i = i1; i < i2; i++) {
        dist += distanceBetween(traces[i], traces[i+1]);
    }
    return dist;
}
function realDistanceBetween(p1, p2, traces) {
    let p1s = [];
    let p2s = [];
    for (let i = 0; i < traces.length; i++) {
        if ((traces[i].x == p1.x) && (traces[i].y == p1.y)) {
            p1s.push(i);
        }
        if ((traces[i].x == p2.x) && (traces[i].y == p2.y)) {
            p2s.push(i);
        }
    }
    let dist = traces.length;
    for (let i in p1s) {
        for (let j in p2s) {
            let d = distBetweenIndex(p1s[i], p2s[i], traces);
            if (d < dist) {
                dist = d;
            }
        }
    }
    return dist;
}