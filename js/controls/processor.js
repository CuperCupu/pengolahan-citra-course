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
    });

    // Equalize
    $('#button-equalize').click(function() {
        image = equalizePixels();
    });
    $('#button-equalize-bright').click(function() {
        image = equalizePixels(1.25);
    });
    $('#button-equalize-dark').click(function() {
        image = equalizePixels(0.75);
    });
    $('#button-equalize-reduce-contrast').click(function() {
        image = equalizePixels(0.85, 0, 0.5);
    });
    $('#button-equalize-increase-contrast').click(function() {
        image = equalizePixels(1.25, 0, 1.5);
    });

    // Specification
    $('#button-spec').click(function() {
        image = setHistSpecification();
        
    });

    $('#button-spec-image').click(function() {
        saveSpecification();
        $('#button-spec-image').addClass('d-none');
        $('#button-spec-custom').removeClass('d-none');
    });

    $('#button-spec-custom').click(function() {
        toggleCustomSpec();
        $('#button-spec-image').removeClass('d-none');
        $('#button-spec-custom').addClass('d-none');
    });

    // Miscellaneous
    $('#button-misc-vivid').click(function() {
        image = setContrast(150);
    });

    $('#button-misc-contrast').click(function() {
        image = setContrast(255, 1.5);
    });

    $('#button-misc-invert').click(function() {
        image = inverseColor();
    });

});