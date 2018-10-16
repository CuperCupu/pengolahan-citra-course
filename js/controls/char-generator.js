// Size in part 0..1
function generateCharacter(canvas, char, font="Arial", bold=false, italic=false, size=0.8) {
    let ctx = canvas.getContext('2d');
    canvas.height = canvas.width;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let fontsize = Math.min(canvas.width, canvas.height) * size;
    ctx.font = fontsize + "px " + font;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline="middle"; 
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

$(document).ready(function() {
    let select = $('#char-control .generator-char');
    for (let i = 33; i < 127; i++) {
        select.append(`<option>
            ${String.fromCharCode(i)}
        </option>`);
    }
    $('#char-control select').change(function() {
        let font = $(this).parent().find('.generator-font');
        let char = $(this).parent().find('.generator-char');
        image_default = generateCharacter(canvas, char.val(), font.val());
        canvas2.height = canvas2.width;
        image = ctx.createImageData(image_default.width, image_default.height);
        image.data.set(image_default.data);
        ctx2.putImageData(image, 0, 0);
        counts = countPixels(image);
        resetColorChart(counts);
        $("#controls").collapse("show");
        for (var i in onReset) {
            onReset[i]();
        }
        let button = $('#button-recognize');
        button.click();
    });
});