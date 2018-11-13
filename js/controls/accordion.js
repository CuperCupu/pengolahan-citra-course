$(document).ready(function() {
    $('.control-container > button').click(function(e) {
        // $('#controls .collapse').collapse('hide');
        let curr = $(this).parent();
        let parent = curr.parent();
        if (parent.hasClass('accordion')) {
            parent.find(".collapse").collapse('hide');
        }
        curr.children(".collapse").collapse('toggle');
    });
})