var drawer = new CanvasDrawer();
down = false;
var last = {
    x: 0,
    y: 0
}

$(document).ready(function() {
    drawer.clear(canvas);
    drawer.clear(canvas2);
    var ctx = canvas.getContext('2d');
    image_default = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // canvas.addEventListener('canvasdrawn', (e) => {
    // });
    canvas2.addEventListener('mousedown', (e) => {
        down = true;
        let rect = e.target.getBoundingClientRect();
        let x = (e.clientX - rect.x) / rect.width;
        let y = (e.clientY - rect.y) / rect.height;
        last.x = x;
        last.y = y;
        drawer.draw(e.target, x, y);
        $("#controls").collapse("show");
    });
    canvas2.addEventListener('mousemove', (e) => {
        if (down) {
            let rect = e.target.getBoundingClientRect();
            let x = (e.clientX - rect.x) / rect.width;
            let y = (e.clientY - rect.y) / rect.height;
            drawer.drawline(e.target, last.x, last.y, x, y);
            last.x = x;
            last.y = y;
        }
    });
    canvas2.addEventListener('mouseup', (e) => {
        if (down) {
            down = false;
            var ctx = e.target.getContext('2d');
            image = ctx.getImageData(0, 0, e.target.width, e.target.height);
            counts = countPixels(image);
            setDirty(e.target);
        }
    });
    canvas2.addEventListener('mouseout', (e) => {
        if (down) {
            down = false;
            var ctx = e.target.getContext('2d');
            image = ctx.getImageData(0, 0, e.target.width, e.target.height);
            counts = countPixels(image);
            setDirty(e.target);
        }
    });
});