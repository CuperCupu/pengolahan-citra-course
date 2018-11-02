var drawer = new CanvasDrawer();
down = false;
var last = {
    x: 0,
    y: 0
}



$(document).ready(function() {
    drawer.clear(canvas);
    drawer.clear(canvas2);
    image_default = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    $('#button-drawing-clear').click(function() {
        drawer.clear(canvas2);
        image_default = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        ctx.putImageData(image_default, 0, 0);
    });
    
    $('#button-drawing-save').click(function() {
        image_default = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        ctx.putImageData(image_default, 0, 0);
    });

    // canvas.addEventListener('canvasdrawn', (e) => {
    // });
    canvas2.addEventListener('mousedown', (e) => {
        if (e.button == 0) {
            down = true;
            let rect = e.target.getBoundingClientRect();
            let x = (e.clientX - rect.x) / rect.width;
            let y = (e.clientY - rect.y) / rect.height;
            last.x = x;
            last.y = y;
            drawer.draw(e.target, x, y);
            $("#controls").collapse("show");
        }
    });
    canvas2.addEventListener('mousemove', (e) => {
        if (e.button == 0) {
            if (down) {
                let rect = e.target.getBoundingClientRect();
                let x = (e.clientX - rect.x) / rect.width;
                let y = (e.clientY - rect.y) / rect.height;
                drawer.drawline(e.target, last.x, last.y, x, y);
                last.x = x;
                last.y = y;
            }
        }
    });
    canvas2.addEventListener('mouseup', (e) => {
        if (e.button == 0) {
            if (down) {
                down = false;
                var ctx = e.target.getContext('2d');
                image = ctx.getImageData(0, 0, e.target.width, e.target.height);
                counts = countPixels(image);
                setDirty(e.target);
            }
        }
    });
    canvas2.addEventListener('mouseout', (e) => {
        if (e.button == 0) {
            if (down) {
                down = false;
                var ctx = e.target.getContext('2d');
                image = ctx.getImageData(0, 0, e.target.width, e.target.height);
                counts = countPixels(image);
                setDirty(e.target);
            }
        }
    });
});