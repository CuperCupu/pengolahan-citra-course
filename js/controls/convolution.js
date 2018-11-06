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
            [[
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ]]
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-edge').click(function() {
        image = operateKernel(image,
            [[
                -1, -1, -1,
                -1, 8, -1,
                -1, -1, -1
            ]],
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
    
    $('#button-kernel-edge2').click(function() {
        image = operateKernel(image,
            [
                0, -1, 0,
                -1, 4, -1,
                0, -1, 0
            ],
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-sobel').click(function() {
        image = operator(image,
            [
                -1, 0, 1,
                -2, 0, 2,
                -1, 0, 1
            ],
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-freichen').click(function() {
        image = operator(image,
            [
                -1, -2, -1,
                0, 0, 0,
                1, 2, 1
            ],
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-robert').click(function() {
        image = operateKernel(image,
            [
                [
                    1, 0,
                    0, -1,
                ],
                [
                    0, 1,
                    -1, 0
                ]
            ],
            2, 0, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-prewitt').click(function() {
        image = operator(image,
            [
                1, 0, -1,
                1, 0, -1,
                1, 0, -1
            ],
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
});