$(document).ready(function() {

    $('#button-median-filter').click(function() {
        image = medianFilter(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
});