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

    toYCrCb() {
        var y = (0.299 * this.r) + (0.587 * this.g) + (0.114 * this.b);
        var b = 128 - (0.168736 * this.r) - (0.331264 * this.g) + (0.5 * this.b);
        var r = 128 + (0.5 * this.r) - (0.418688 * this.g) - (0.081312 * this.b);
        return new Color(y, b, r, this.a);
    }

    fromYCrCb() {
        var cb = (this.g - 128);
        var cr = (this.b - 128);
        var r = this.r + 1.402 * cr;
        var g = this.r - 0.344136 * cb - 0.714136 * cr;
        var b = this.r + 1.772 * cb;
        return new Color(r, g, b, this.a);
    }
}

class Boundary {
    constructor(minX, maxX, minY, maxY) {
        this.min = {
            x: minX,
            y: minY
        }
        this.max = {
            x: maxX,
            y: maxY
        }
    }

    inBound(x, y) {
        return ((x >= this.min.x) && (x <= this.max.x) &&
            (y >= this.min.y) && (y <= this.max.y));
    }

    /**
     * @param {Boundary} other 
     */
    isOverlapping(other) {
        return other.inBound(this.min.x, this.min. y) ||
            other.inBound(this.min.x, this.max.y) ||
            other.inBound(this.max.x, this.min.y) ||
            other.inBound(this.max.x, this.max.y)
    }

    getWidth() {
        return this.max.x - this.min.x + 1;
    }

    getHeight() {
        return this.max.y - this.min.y + 1;
    }
}