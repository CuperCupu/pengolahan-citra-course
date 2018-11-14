$(document).ready(function() {
    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });

    var BWthreshold = 50;

    $('#button-recog-1').click(function() {
        resetPixels();
        image = operator(image,
            [
                -1, 0, 1,
                -2, 0, 2,
                -1, 0, 1
            ],
            3, -1, true
        );
        // image = sampler.resize(image, image.width / 4, image.height / 4, sampler.sampler.median);
        image = contrastStretch(image, -100, 350, 0, 255);
        image = setBlackWhite(image, BWthreshold);
        // image = util.removeDot(image).result;
        canvas2.width = image.width;
        canvas2.height = image.height;
        var map = density.createDensityMap(image, util.neighbours.square(1));
        // map.reduce(3);
        // image = density.visualizeDensityMap(map, new Color(0, 0, 0, 255), new Color(1, 1, 1, 1), 0.2);
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-recog-2').click(function() {
        resetPixels();
        image = operator(image,
            operators.sobel,
            3, -1, true
        );
        image = medianFilter(image);
        // image = sampler.resize(image, image.width / 2, image.height / 2, sampler.sampler.median);
        image = contrastStretch(image, -100, 300, 0, 255);
        var map = density.createDensityMap(image, util.neighbours.square(1));
        var avg = map.getAverage();
        image = setBlackWhite(image, avg * 0.05);
        // image = util.fillDot(image).result;
        // var c;
        // do {
        //     var res = util.removeDot(image, 1);
        //     image = res.result;
        //     console.log(res.counts);
        //     c = res.counts;
        //     ctx2.putImageData(image, 0, 0);
        // } while (c > 0);
        map.normalize();
        // map.reduce(3);
        // map.propagate(1);
        map.regenerate(util.neighbours.square(5));
        map.normalize();
        avg = map.getAverage();
        console.log(avg);
        // image = density.visualizer.visualize(map, density.visualizer.cm.gradient, {
        //     low: new Color(0, 0, 0, 255),
        //     high: new Color(255, 255, 255, 255),
        //     cutoff: 0,
        // });
        var mark = density.visualizer.mark(map, density.visualizer.cm.binary, {
            low: new Color(255, 0, 0, 255),
            high: new Color(255, 0, 0, 255),
            cutoff: 0,
            min: 0.7,
            max: 1,
        })
        // image = util.image.blend(mark, image_default);
        map.map((e) => { return (e > 0.125) ? 1 : 0; })
        image = density.mask.image(map, image_default);
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

    $('#button-recog-3').click(function(){
        resetPixels();
        image = findFaceObject(image);
        canvas2.width = image.width;
        canvas2.height = image.height;
        ctx2.putImageData(image, 0, 0);
        setDirty(canvas2);
    });

});