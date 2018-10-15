$(document).ready(function() {
    
    $('.control-container >  button').click(function(e) {
        $('#controls .collapse').collapse('hide');
        let id = '#' + $(e.target).attr('target');
        $(id).collapse('show');
    });

    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        resetPoints();
    });

    // Equalize
    $('#button-equalize').click(function() {
        equalizePixels();
    });

    // Specification
    $('#button-spec').click(function() {
        setHistSpecification();
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

});