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
                var turningPoints = findTurningPoints(image);
                for (var i = 0; i < turningPoints.length; i++){
                    image.data[turningPoints[i]] = 250;
                    image.data[turningPoints[i] + 1] = 0;
                    image.data[turningPoints[i] + 2] = 0;
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
});