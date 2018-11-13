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