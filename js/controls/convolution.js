var operators = {
    sobel: [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ],
    freichen: [
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ],
    robert: [
        1, 0,
        0, -1,
    ],
    prewitt: [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
    ]
}

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
            [[
                0, -1, 0,
                -1, 4, -1,
                0, -1, 0
            ]],
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-sobel').click(function() {
        image = operator(image,
            operators.sobel,
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-freichen').click(function() {
        image = operator(image,
            operators.freichen,
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-robert').click(function() {
        image = operator(image,
            operators.robert,
            2, 0, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-prewitt').click(function() {
        image = operator(image,
            operators.prewitt,
            3, -1, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-kernel-custom').click(function() {
        var val = $("#textarea-kernel-custom").val();
        var splits = val.split(/\s|,|\n/);
        var mat = [];
        for (var i in splits) {
            var t = splits[i].replace(/^\s+|\s+$/g, '');
            if (t != "") {
                mat.push(parseFloat(t));
            }
        }
        var size = Math.sqrt(mat.length);
        var dimension = parseInt(size);
        if (size != dimension) {
            alert("Invalid matrix dimension");
            return;
        }
        var offset = parseInt((1 - dimension) / 2);
        image = operator(image,
            mat,
            dimension, offset, true
        );
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });
});