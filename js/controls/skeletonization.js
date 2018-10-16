$(document).ready(function() {

    var currentSkeletonizeStage = 0;

    onReset.push(function() {
        currentSkeletonizeStage = 0;
    })

    skeletonizeStaged = function(stage) {
        if (stage > currentSkeletonizeStage) {
            if (currentSkeletonizeStage < stage) {
                skeletonizeStaged(stage - 1);
            }
            if (stage == 1) {
                // Preprocess
                image = preprocessImage(image);
            } else if (stage == 2) {
                // Zhangsuen
                image = skeletonizeImage(image);
            } else if (stage == 3) {
                // Post process
                image = postprocessImage(image);
            } else if (stage == 4) {
                // Remove fake lines
                var endPoints = findEndPointsRaw(image);
                var crucialPoints = findCrucialPoints(image);
                var triplePoints = findTriplePoints(image);
                image = removeFakeLinesThreshold(image, endPoints, triplePoints, crucialPoints);
            } else if (stage == 5) {
                var b = findBoundary(image);
                var t = findTurningPointsAll(b);
                s = t.sliced;
                if (s < 0) {
                    s = 0;
                }
                var translate_index = function(i, off, length) {
                    if (off > -1) {
                        i += off;
                    }
                    i %= length;
                    return i;
                }
                for (var i in t.turningPoints) {
                    let j = translate_index(t.turningPoints[i], t.sliced, b.code.length);
                    setImgPixelAt(image, b.trace[j].x, b.trace[j].y, new Color(255, 0, 0));
                }
                
            }
            currentSkeletonizeStage = stage;
        }
        return stage;
    }

    let buttons = [
        '#button-skeleton-preprocess',
        '#button-skeleton-zhangsuen',
        '#button-skeleton-postprocess',
        '#button-skeleton-removefakelines',
        '#button-skeleton-turningpoints',
        '#button-skeleton-all'
    ]
    for (var i in buttons) {
        let button = $(buttons[i]);
        button.attr('stage', parseInt(i)+1);
        button.click(function() {
            skeletonizeStaged($(this).attr('stage'));
            ctx2.putImageData(image, 0, 0);
        });
    }
    let button = $('#button-recognize');
    button.attr('stage', buttons.length+1);
    button.click(function(e) {
        skeletonizeStaged($(this).attr('stage'));
        ctx2.putImageData(image, 0, 0);
        let result = match_all_heuristics_from_image(image);
        if (result.length > 0) {
            $('#recognize-result').text(result);
        } else {
            $('#recognize-result').text('No match');
        }
        let curr = $('#container-recognition');
        let col = curr.find('.collapse');
        if (!col.hasClass('show')) {
            let button = curr.find('> button');
            button.click();
        }

    });
});