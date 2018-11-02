$(document).ready(function() {

    $('#button-median-filter').click(function() {
        image = medianFilter(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
    $('#button-diff').click(function() {
        image = differenceOperator(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-grad').click(function() {
        image = gradienceOperator(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-sharp').click(function() {
        image = operateKernel(image,
            [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ]
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-edge').click(function() {
        image = operateKernel(image,
            [
                -1, -1, -1,
                -1, 8, -1,
                -1, -1, -1
            ],
            1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
});