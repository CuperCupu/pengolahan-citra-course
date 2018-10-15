class CharacterHeuristic{
    constructor(data) {
        this.char = data.char;
        this.endPoints = data.endPoints;
        this.turningPoints = data.turningPoints;
        this.minRatio = data.minRatio;
        this.maxRatio = data.maxRatio;
    }

    match(ratio, endPoints, turningPoints) {
        // Test against ratio.
        if ((this.minRatio !== null) && (ratio < this.minRatio)) {
            return false;
        }
        if ((this.maxRatio !== null) && (ratio > this.maxRatio)) {
            return false;
        }
        if ((endPoints.length === this.endPoints.length) && (turningPoints.length === this.turningPoints.length)) {
            
        }
        return false;
    }
}

var character_heuristics = []