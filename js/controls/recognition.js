$(document).ready(function() {
    // Reset
    $('#button-reset').click(function() {
        resetPixels();
        setDirty(canvas2, false);
    });

    var BWthreshold = 50;

    $('#button-recog-1').click(function() {
        resetPixels();
        image = medianFilter(image);
        var map_skin = skinmap.YCbCr(image);
        // var map = density.createDensityMap(edge, util.neighbours.circle(0));
        // map.mult(map_skin);
        // map.add(map_skin);
        // image = density.mask.image(map_skin, image_default);
        // image = density.visualizer.visualize(map_skin, density.visualizer.cm.binary, {
        //     low: new Color(0, 0, 0, 255),
        //     high: new Color(255, 255, 255, 255),
        //     cutoff: 0.1
        // })
        // image = sampler.resize(image, image.width / 2, image.height / 2, sampler.sampler.median);
        // console.log(util.neighbours.circle(2));
        // var map = density.createDensityMap(image, util.neighbours.circle(2));
        // image = density.visualizer.visualize(map, density.visualizer.cm.gradient, {
        //     low: new Color(0, 0, 0, 255),
        //     high: new Color(255, 255, 255, 255),
        //     cutoff: 0
        // })
        // image = density.mask.image(map_skin, edge);
        // image = skin;
        // image = util.fillDot(image).result;
        // var c;
        // do {
        //     var res = util.removeDot(image, 1);
        //     image = res.result;
        //     console.log(res.counts);
        //     c = res.counts;
        //     ctx2.putImageData(image, 0, 0);
        // } while (c > 0);
        var blob = density.blobs.label(map_skin);
        var blobs = density.blobs.retrieve(blob);
        console.log(blobs);
        image = density.visualizer.visualize(blob, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })
        var maxb = density.blobs.selectLargest(image, blobs);
        var vis = density.createDensityMap(image, util.neighbours.identity);
        var b = findBoundary(image);
        var trace = new density.DensityMap(image.width, image.height);
        trace.map(_ => 0);
        for (var k in b.trace) {
            trace.setAt(b.trace[k].x, b.trace[k].y, 1);
        }
        var filled = density.filler.fill(trace, Math.round(maxb.center.x), Math.round(maxb.center.y));
        filled.sub(trace);
        var hole = density.copy(filled).sub(vis);
        image = density.visualizer.visualize(hole, density.visualizer.cm.binary, {
            low: new Color(0, 0, 0, 255),
            high: new Color(255, 255, 255, 255),
            cutoff: 1
        })

        canvas2.width = image.width;
        canvas2.height = image.height;
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
        // map.map((e) => { return (e > 0.125) ? 1 : 0; })
        // image = density.mask.image(map, image_default);
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