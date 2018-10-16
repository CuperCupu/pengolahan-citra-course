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
                var endPoints = findEndPoints(image);
                var crucialPoints = findCrucialPoints(image);
                var triplePoints = findTriplePoints(image);
                image = removeFakeLines(image, endPoints, triplePoints, crucialPoints);
            } else if (stage == 5) {
                // var turningPoints = findTurningPoints(image);
                // for (var i = 0; i < turningPoints.length; i++){
                //     image.data[turningPoints[i]] = 250;
                //     image.data[turningPoints[i] + 1] = 0;
                //     image.data[turningPoints[i] + 2] = 0;
                // }
                var b = findBoundary(image);
                var t = findTurningPointsFromTrace(b);
                s = t.sliced;
                if (s < 0) {
                    s = 0;
                }
                var translate_index = function(i, off, length) {
                    if (off > -1) {
                        i = (i + off) % length;
                    }
                    return i;
                }
                // var t = findTurningPointsFromChainCode(b.code);
                for (var i in t.suspicious) {
                    let j = translate_index(t.suspicious[i], t.sliced, b.code.length);
                    // setImgPixelAt(image, b.trace[j].x, b.trace[j].y, new Color(0, 255, 255));
                }
                for (var i in t.turningPoints) {
                    let j = translate_index(t.turningPoints[i], t.sliced, b.code.length);
                    // setImgPixelAt(image, b.trace[j].x, b.trace[j].y, new Color(255, 0, 0));
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
    });
});