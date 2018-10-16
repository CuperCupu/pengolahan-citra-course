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
        this.minRatio = data.minRatio;
        this.maxRatio = data.maxRatio;
    }

    match(ratio, endPoints, turningPoints) {
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
        match = true;
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
    return true;
}

CharacterHeuristic.matchTurningPoint = function(point, rule) {
    if (rule.quadrants) {
        if (!rule.quadrants.includes(point.quadrant)) {
            return false;
        }
    }
    return true;
}

var character_heuristics = [];

match_all_heuristics = function(ratio, endPoints, turningPoints) {
    let matched = [];
    for (var i in character_heuristics) {
        let h = character_heuristics[i];
        if (!matched.includes(h.name)) {
            if (h.match(ratio, endPoints, turningPoints)) {
                matched.push(h.name);
            }
        }
    }
    return matched;
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
            i = (i + off) % length;
        }
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
            direction: endPointDirection(e[i].x, e[i].y, image)
        });
    }
    let turningpoints = [];
    for (var i in t.turningPoints) {
        let j = translate_index(t.turningPoints[i], t.sliced, b.code.length);
        turningpoints.push({
            point: b.trace[j],
            quadrant: categorizeQuadrant(getOffsetFromCenter(b.trace[j].x, b.trace[j].y, center))
        });
    }
    console.log(endpoints);
    console.log(turningpoints);
    console.log(ratio, width, height);
    return match_all_heuristics(ratio, endpoints, turningpoints);
}