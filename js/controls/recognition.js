$(document).ready(function() {
    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });
});