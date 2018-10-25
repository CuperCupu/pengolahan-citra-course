class CanvasDrawer {

    constructor(brush_size = 10, brush_color = 'white') {
        this.brush_size = brush_size;
        this.brush_color = brush_color;
        this.drawevent = new Event('canvasdrawn');
        this.clearevent = new Event('canvascleared');
    }

    draw(canvas, x, y) {
        x *= canvas.width;
        y *= canvas.height;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = this.brush_color;
        ctx.arc(x, y, this.brush_size, 0, 2 * Math.PI);
        ctx.fill();
        canvas.dispatchEvent(this.drawevent);
    }

    drawline(canvas, x1, y1, x2, y2) {
        x1 *= canvas.width;
        y1 *= canvas.height;
        x2 *= canvas.width;
        y2 *= canvas.height;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size * 2;
        ctx.lineCap="round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        canvas.dispatchEvent(this.drawevent);
    }

    clear(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.dispatchEvent(this.clearevent);
    }

}

var enableCanvasDrawing = function(canvas) {
    if (canvas) {
        canvas.addEventListener('mousedown', (e) => {
            
        });
        canvas.addEventListener('mouseup', (e) => {

        });
        canvas.addEventListener('mousemove', (e) => {

        });
    }
}
var disableCanvasDrawing = function(canvas) {
    if (canvas) {
        canvas.removeEventListener('mousedown');
        canvas.removeEventListener('mouseup');
        canvas.removeEventListener('mousemove');
    }
}