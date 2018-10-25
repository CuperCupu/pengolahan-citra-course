$(document).ready(function() {
    
    $('.control-container > button').click(function(e) {
        // $('#controls .collapse').collapse('hide');
        let curr = $(this).parent();
        let parent = curr.parent();
        if (parent.hasClass('accordion')) {
            parent.find(".collapse").collapse('hide');
        }
        curr.find(".collapse").collapse('toggle');
    });

    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });

    // Equalize
    $('#button-equalize').click(function() {
        image = equalizePixels();
        setDirty(canvas2);
    });
    $('#button-equalize-bright').click(function() {
        image = equalizePixels(1.25);
        setDirty(canvas2);
    });
    $('#button-equalize-dark').click(function() {
        image = equalizePixels(0.75);
        setDirty(canvas2);
    });
    $('#button-equalize-reduce-contrast').click(function() {
        image = equalizePixels(0.85, 0, 0.5);
        setDirty(canvas2);
    });
    $('#button-equalize-increase-contrast').click(function() {
        image = equalizePixels(1.25, 0, 1.5);
        setDirty(canvas2);
    });

    // Specification
    $('#button-spec').click(function() {
        image = setHistSpecification();
        setDirty(canvas2);
    });

    $('#button-spec-image').click(function() {
        saveSpecification();
        $('#button-spec-image').addClass('d-none');
        $('#button-spec-custom').removeClass('d-none');
        setDirty(canvas2);
    });

    $('#button-spec-custom').click(function() {
        toggleCustomSpec();
        $('#button-spec-image').removeClass('d-none');
        $('#button-spec-custom').addClass('d-none');
        setDirty(canvas2);
    });

    // Miscellaneous
    $('#button-misc-vivid').click(function() {
        image = setContrast(image, 150);
        setDirty(canvas2);
    });

    $('#button-misc-contrast').click(function() {
        image = setContrast(image, 255, 1.5);
        setDirty(canvas2);
    });

    $('#button-misc-invert').click(function() {
        image = inverseColor(image, );
        setDirty(canvas2);
    });

    // Channel
    
    // Red
    $('#button-channel-red').click(function() {
        image = setChannel(image, 1, 0, 0);
        ctx2.putImageData(image, 0, 0);
        resetColorChart(countPixels(image));
        setDirty(canvas2);
    });
    // Green
    $('#button-channel-green').click(function() {
        image = setChannel(image, 0, 1, 0);
        ctx2.putImageData(image, 0, 0);
        resetColorChart(countPixels(image));
        setDirty(canvas2);
    });
    // Blue
    $('#button-channel-blue').click(function() {
        image = setChannel(image, 0, 0, 1);
        ctx2.putImageData(image, 0, 0);
        resetColorChart(countPixels(image));
        setDirty(canvas2);
    });

    // Grayscale
    $('#button-channel-grayscale').click(function() {
        image = setGrayscale(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    // Black White
    $('#button-channel-blackwhite').click(function() {
        image = setBlackWhite(image);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

});

dirtyevent = new Event('elementdirty');
cleanevent = new Event('elementclean');

setDirty = function(element, target = true) {
    $(element).attr('dirty', target);
    if (target) {
        element.dispatchEvent(dirtyevent);
    } else {
        element.dispatchEvent(cleanevent);
    }
}

isDirty = function(element) {
    let a = $(element).attr('dirty');
    return a == null || a;
}