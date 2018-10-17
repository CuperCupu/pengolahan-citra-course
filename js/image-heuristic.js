class CharacterHeuristic{
    constructor(data) {
        this.name = data.name;
        if (data.endPoints) {
            this.endPoints = data.endPoints;
            this.endPointCount = data.endPointCount;
            this.endPointMinCount = data.endPointMinCount;
            this.endPointMaxCount = data.endPointMaxCount;
        } else {
            this.endPoints = [];
            this.endPointCount = 0;
        }
        if (data.turningPoints) {
            this.turningPoints = data.turningPoints;
            this.turningPointCount = data.turningPointCount;
            this.turningMinPointCount = data.turningMinPointCount;
            this.turningMaxPointCount = data.turningMaxPointCount;
        } else {
            this.turningPoints = [];
            this.turningPointCount = 0;
        }
        if (data.dots) {
            this.dots = data.dots;
            this.dotCount = data.dotCount;
        } else {
            this.dots = [];
            this.dotCount = 0;
        }
        this.strict = data.strict;
        if (this.strict) {
            console.log(this.name, CharacterHeuristic.calculateStrict(this.endPoints), CharacterHeuristic.calculateStrict(this.turningPoints));
            this.endPoints.push(CharacterHeuristic.calculateStrict(this.endPoints));
            this.turningPoints.push(CharacterHeuristic.calculateStrict(this.turningPoints));
        }
        this.minRatio = data.minRatio;
        this.maxRatio = data.maxRatio;
        this.custom = data.custom;
        this.minLengthRatio = data.minLengthRatio;
        this.maxLengthRatio = data.maxLengthRatio;
    }

    match(ratio, endPoints, turningPoints, dots, code, trace) {
        // Test against ratio.
        if ((this.minRatio != null) && (ratio < this.minRatio)) {
            return false;
        }
        if ((this.maxRatio != null) && (ratio > this.maxRatio)) {
            return false;
        }
        if ((this.endPointCount != null) && (endPoints.length != this.endPointCount)) {
            return false;
        }
        if ((this.turningPointCount != null) && (turningPoints.length != this.turningPointCount)) {
            return false;
        }
        if ((this.dotCount != null) && (dots.length != this.dotCount)) {
            return false;
        }
        // Test against end points.
        let match = true;
        let i = 0;
        while ((match) && (i < this.endPoints.length)) {
            let rule = this.endPoints[i];
            let count = 0;
            for (var j in endPoints) {
                let p = endPoints[j];
                if (CharacterHeuristic.matchEndPoint(p, rule)) {
                    count++;
                }
            }
            if (rule.count != null) {
                match = count == rule.count;
            } else if ((rule.minCount != null) && (rule.maxCount == null)) {
                match = count >= rule.minCount;
            } else if ((rule.minCount == null) && (rule.maxCount != null)) {
                match = count <= rule.maxCount;
            } else if ((rule.minCount != null) && (rule.maxCount != null)) {
                match = count >= rule.minCount && count <= rule.maxCount;
            } else {
                match = count > 0;
            }
            i++;
        }
        // Test against turning points.
        i = 0;
        while ((match) && (i < this.turningPoints.length)) {
            let rule = this.turningPoints[i];
            let count = 0;
            for (var j in turningPoints) {
                let p = turningPoints[j];
                if (CharacterHeuristic.matchTurningPoint(p, rule)) {
                    count++;
                }
            }
            if (rule.count != null) {
                match = count == rule.count;
            } else if ((rule.minCount != null) && (rule.maxCount == null)) {
                match = count >= rule.minCount;
            } else if ((rule.minCount == null) && (rule.maxCount != null)) {
                match = count <= rule.maxCount;
            } else if ((rule.minCount != null) && (rule.maxCount != null)) {
                match = count >= rule.minCount && count <= rule.maxCount;
            } else {
                match = count > 0;
            }
            i++;
        }
        // Test against dots.
        i = 0;
        while ((match) && (i < this.dots.length)) {
            let rule = this.dots[i];
            let count = 0;
            for (var j in dots) {
                let p = dots[j];
                if (CharacterHeuristic.matchDot(p, rule)) {
                    count++;
                }
            }
            if (rule.count != null) {
                match = count == rule.count;
            } else if ((rule.minCount != null) && (rule.maxCount == null)) {
                match = count >= rule.minCount;
            } else if ((rule.minCount == null) && (rule.maxCount != null)) {
                match = count <= rule.maxCount;
            } else if ((rule.minCount != null) && (rule.maxCount != null)) {
                match = count >= rule.minCount && count <= rule.maxCount;
            } else {
                match = count > 0;
            }
            i++;
        }

        if ((match) && (endPoints.length == 2) && ((this.minLengthRatio != null) || (this.maxLengthRatio != null))) {
            let dist = realDistanceBetween(endPoints[0].point, endPoints[1].point, trace);
            let r_dist = distanceBetween(endPoints[0].point, endPoints[1].point);
            let lengthRatio = dist / r_dist;
            if ((this.minLengthRatio != null) && (this.maxLengthRatio == null)) {
                match = lengthRatio >= this.minLengthRatio;
            } else if ((this.minLengthRatio == null) && (this.maxLengthRatio != null)) {
                match = lengthRatio <= this.maxLengthRatio;
            } else if ((this.minLengthRatio != null) && (this.maxLengthRatio != null)) {
                match = lengthRatio >= this.minLengthRatio && lengthRatio <= this.maxLengthRatio;
            }
            console.log(lengthRatio);
        }

        if ((match) && (this.custom != null)) {
            match = this.custom({
                ratio: ratio, 
                endPoints: endPoints,
                turningPoints: turningPoints,
                dots: dots,
                trace: trace,
                code: code
            })
        }

        return match;
    }
}

CharacterHeuristic.calculateStrict = function(rules) {
    let grids = new Array(16).fill(true);
    for (var i in rules) {
        if (rules[i].grids) {
            for (let j = 0; j < rules[i].grids.length; j++) {
                grids[rules[i].grids[j] - 1] = false;
            }
        }
        if (rules[i].quadrants) {
            for (let j = 0; j < rules[i].quadrants.length; j++) {
                let q = rules[i].quadrants[j];
                if (q == 2) {
                    grids[2] = false;
                    grids[3] = false;
                    grids[6] = false;
                    grids[7] = false;
                } else if (q == 4) {
                    grids[0] = false;
                    grids[1] = false;
                    grids[4] = false;
                    grids[5] = false;
                } else if (q == 6) {
                    grids[8] = false;
                    grids[9] = false;
                    grids[12] = false;
                    grids[13] = false;
                } else if (q == 8) {
                    grids[10] = false;
                    grids[11] = false;
                    grids[14] = false;
                    grids[15] = false;
                }
            }
        }
    }
    let r = [];
    for (let i = 0; i < 16; i++) {
        if (grids[i]) {
            r.push(i+1);
        }
    }
    return {
        maxCount: 0,
        grids: r
    }
}

CharacterHeuristic.matchEndPoint = function(point, rule) {
    if (rule.quadrants) {
        if (!rule.quadrants.includes(point.quadrant)) {
            return false;
        }
    }
    if (rule.directions) {
        if (!rule.directions.includes(point.direction)) {
            return false;
        }
    }
    if (rule.grids) {
        if (!rule.grids.includes(point.grid)) {
            return false;
        }
    }
    return true;
}

CharacterHeuristic.matchTurningPoint = function(point, rule) {
    if (rule.quadrants) {
        if (!rule.quadrants.includes(point.quadrant)) {
            return false;
        }
    }
    if (rule.grids) {
        if (!rule.grids.includes(point.grid)) {
            return false;
        }
    }
    return true;
}

CharacterHeuristic.matchDot = function(point, rule) {
    if (rule.quadrants) {
        if (!rule.quadrants.includes(point.quadrant)) {
            return false;
        }
    }
    if (rule.grids) {
        if (!rule.grids.includes(point.grid)) {
            return false;
        }
    }
    return true;
}

var character_heuristics = [];

match_all_heuristics = function(ratio, endPoints, turningPoints, dots, code, trace) {
    let matched = [];
    for (var i in character_heuristics) {
        let h = character_heuristics[i];
        if (!matched.includes(h.name)) {
            if (h.match(ratio, endPoints, turningPoints, dots, code, trace)) {
                matched.push(h.name);
            }
        }
    }
    return matched;
}

pointGrid = function(p, bound, gridSize = 4) {
    let x = (p.x - bound.min.x) / bound.width;
    let y = (p.y - bound.min.y) / bound.height;
    let space = 1 / gridSize;
    x = Math.floor(x / space);
    y = Math.floor(y / space)
    return x + (y * gridSize) + 1;
}

findTurningPointsAll = function(b, threshold=0.1) {
    var translate_index = function(i, off, length) {
        if (off > -1) {
            i += off;
        }
        i %= length;
        return i;
    }
    threshold = b.size.height * threshold;
    var t1 = findTurningPointsFromTrace(b);
    var t2 = findTurningPointsFromTrace2(b);
    var turningPoints = t1.turningPoints.slice().concat(t2.turningPoints);
    // var turningPoints = t1.turningPoints.slice();
    var trace = b.trace;
    let changed = false;
    var findNearest = function(p, trace) {
        var min = trace.length;
        var idx = -1;
        for (let i = 0; i < trace.length; i++) {
            let d = distanceBetween(p, trace[i]);
            if (d < min) {
                min = d;
                idx = i;
            }
        }
        return idx;
    }
    do {
        changed = false;
        let i1 = -1;
        let i2 = -1;
        let ti1 = -1;
        let ti2 = -1;
        let min = trace.length * 2;
        let i = 0;
        while ((!changed) && (i < turningPoints.length)) {
            let j = 0;
            while ((!changed) && (j < turningPoints.length)) {
                if (i != j) {
                    let idx1 = translate_index(turningPoints[i], t1.sliced, b.code.length);
                    let idx2 = translate_index(turningPoints[j], t1.sliced, b.code.length);
                    // let res = realPositionBetween(trace[idx1], trace[idx2], trace);
                    // if (res.dist < threshold * 2) {
                    //     if (i > j) {
                    //         turningPoints.splice(i, 1);
                    //         turningPoints.splice(j, 1);
                    //     } else {
                    //         turningPoints.splice(j, 1);
                    //         turningPoints.splice(i, 1);
                    //     }
                    //     turningPoints.push(Math.round((res.p1 + res.p2) / 2));
                    //     changed = true;
                    // }
                    let dist = distanceBetween(trace[idx1], trace[idx2]);
                    if (dist < min) {
                        min = dist;
                        i1 = idx1;
                        i2 = idx2;
                        ti1 = i;
                        ti2 = j;
                    }
                }
                j++;
            }
            i++;
        }
        if ((ti1 > -1) && ((min < threshold * 2))) {
            // turningPoints.splice(j, 1);
            if (ti1 > ti2) {
                turningPoints.splice(ti1, 1);
                turningPoints.splice(ti2, 1);
            } else {
                turningPoints.splice(ti2, 1);
                turningPoints.splice(ti1, 1);
            }
            let p = new Point(Math.round((trace[i1].x + trace[i2].x) / 2), Math.round((trace[i1].y + trace[i2].y) / 2));
            let idx = findNearest(p, trace);
            if (idx > -1) {
                if (t1.sliced > -1) {
                    idx -= t1.sliced;
                }
                turningPoints.push(idx);
            } else {
                turningPoints.push(i1);
            }
            changed = true;
        }
    } while (changed);
    return {
        turningPoints: turningPoints,
        sliced: t1.sliced
    }
}

match_all_heuristics_from_image = function(image) {
    var b = findBoundary(image);
    var t = findTurningPointsAll(b);
    s = t.sliced;
    if (s < 0) {
        s = 0;
    }
    var translate_index = function(i, off, length) {
        if (off > -1) {
            i += off;
        }
        i %= length;
        return i;
    }
    let bound = findBound(image);
    let ratio = bound.height / bound.width;
    let center = {
        x: bound.min.x + (bound.width / 2),
        y: bound.min.y + (bound.height / 2)
    }
    let endpoints = [];
    let e = findEndPoints(image);
    for (var i in e) {
        endpoints.push({
            point: e[i],
            quadrant: categorizeQuadrant(getOffsetFromCenter(e[i].x, e[i].y, center)),
            direction: endPointDirection(e[i].x, e[i].y, image),
            grid: pointGrid(e[i], bound),
        });
    }
    let turningpoints = [];
    for (var i in t.turningPoints) {
        let j = translate_index(t.turningPoints[i], t.sliced, b.code.length);
        turningpoints.push({
            point: b.trace[j],
            quadrant: categorizeQuadrant(getOffsetFromCenter(b.trace[j].x, b.trace[j].y, center)),
            grid: pointGrid(b.trace[j], bound),
        });
    }
    let d = findDots(image);
    let dots = []
    for (var i in d) {
        dots.push({
            point: d[i],
            quadrant: categorizeQuadrant(getOffsetFromCenter(d[i].x, d[i].y, center)),
            grid: pointGrid(d[i], bound),
        });
    }
    console.log(endpoints);
    console.log(turningpoints);
    console.log(dots);
    console.log(ratio);
    return match_all_heuristics(ratio, endpoints, turningpoints, dots, b.code, b.trace);
}