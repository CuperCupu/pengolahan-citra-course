class CharacterHeuristic{
    constructor(data) {
        this.name = data.name;
        if (data.endPoints) {
            this.endPoints = data.endPoints;
            this.endPointCount = data.endPointCount;
        } else {
            this.endPoints = [];
            this.endPointCount = 0;
        }
        if (data.turningPoints) {
            this.turningPoints = data.turningPoints;
            this.turningPointCount = data.turningPointCount;
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
        this.minRatio = data.minRatio;
        this.maxRatio = data.maxRatio;
    }

    match(ratio, endPoints, turningPoints, dots) {
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
                match = count >= ruleminCount;
            } else if ((rule.minCount == null) && (rule.maxCount != null)) {
                match = count >= rule.maxCount;
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
                match = count >= ruleminCount;
            } else if ((rule.minCount == null) && (rule.maxCount != null)) {
                match = count >= rule.maxCount;
            } else if ((rule.minCount != null) && (rule.maxCount != null)) {
                match = count >= rule.minCount && count <= rule.maxCount;
            } else {
                match = count > 0;
            }
            i++;
        }

        return match;
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

match_all_heuristics = function(ratio, endPoints, turningPoints, dots) {
    let matched = [];
    for (var i in character_heuristics) {
        let h = character_heuristics[i];
        if (!matched.includes(h.name)) {
            if (h.match(ratio, endPoints, turningPoints, dots)) {
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

match_all_heuristics_from_image = function(image) {
    var b = findBoundary(image);
    var t = findTurningPointsFromTrace2(b);
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
    let width = (bound.max.x - bound.min.x);
    let height = (bound.max.y - bound.min.y);
    let ratio = height / width;
    let center = {
        x: bound.min.x + (width / 2),
        y: bound.min.y + (height / 2)
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
    console.log(ratio, width, height);
    return match_all_heuristics(ratio, endpoints, turningpoints, dots);
}