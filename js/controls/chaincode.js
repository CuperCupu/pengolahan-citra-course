$(document).ready(function() {

    // Webcam controls
    $('#button-chaincode-preprocess').click(function() {
        image = preprocessImage(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
    $('#button-chaincode-show').click(function() {
        let b = findBoundary(image);
        alert(b.code);
    });

    $('#button-chaincode-display').click(function() {
        let b = findBoundary(image);
        for (let i = 0; i < b.trace.length; i++) {
            setImgPixelAt(image, b.trace[i].x, b.trace[i].y, new Color(255, 0, 0, 255));
        }
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
});