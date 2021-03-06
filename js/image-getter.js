navigator.getUserMedia = ( navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);

var video;
var webcamStream;
var image;
var image_default;
var counts;
Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}

var onReset = [];

function startWebcam() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia (
            // constraints
            {
                video: {width: {exact: 640}, height: {exact: 480}},
                audio: false
            },

            // successCallback
            function(localMediaStream) {
                video = document.querySelector('video');
                video.srcObject = localMediaStream;
                webcamStream = localMediaStream;
                $("#webcam-control").removeClass("d-none");
            },

            // errorCallback
            function(err) {
                console.log("The following error occured: " + err);
                if (err instanceof DOMException) {
                    alert("Webcam permission denied.");
                    $("#snapshot").removeClass("d-flex");
                    $("#snapshot").addClass("d-none");
                }
            }
        );
    } else {
        console.log("getUserMedia not supported");
        $("#snapshot").removeClass("d-flex");
        $("#snapshot").addClass("d-none");
    }
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(function (track) { track.stop(); });
    }
}

//---------------------
// TAKE A SNAPSHOT CODE
//---------------------
var canvas, ctx, canvas2, ctx2, reference_freq;
var custom_spec_enabled = true;

$(document).ready(function() {
    // Get the canvas and obtain a context for
    // drawing in it
    canvas = document.getElementById("image_canvas");
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    canvas2 = document.getElementById("image_canvas_2");
    ctx2 = canvas2.getContext('2d');
    ctx2.imageSmoothingEnabled = false;
    ctx2.msImageSmoothingEnabled = false;
    ctx2.mozImageSmoothingEnabled = false;
    ctx2.webkitImageSmoothingEnabled = false;
    if ((location.protocol !== "https:") && (location.hostname != "localhost")) {
        $("#snapshot").removeClass("d-flex");
        $("#snapshot").addClass("d-none");
    }
});

function snapshot() {
    if (video) {
        var width = video.width;
        var height = video.height;
        var orientation = screen.msOrientation || (screen.orientation || screen.mozOrientation || {}).type;
        if ((orientation === "landscape-primary") ||(orientation === "landscape-secondary")) {
        } else if ((orientation === "portrait-primary") || (orientation === "portrait-secondary") ){
            width = video.height;
            height = video.width;
        }
        canvas.width = width;
        canvas.height = height;
        canvas2.width = width;
        canvas2.height = height;
        ctx.drawImage(video, 0, 0);
        image_default = ctx.getImageData(0, 0, canvas.width, canvas.height);
        image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx2.putImageData(image, 0, 0);
        counts = countPixels(image);
        if (typeof resetColorChart != 'undefined') {
            resetColorChart(counts);
        }
        $("#controls").collapse("show");
        for (var i in onReset) {
            onReset[i]();
        }
    }
}

function load_image_file(img_url) {
    try {
        var img = new Image();
        var reader = new FileReader();
        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var rotation = 0;
            var orientation = 0;
            EXIF.getData(this, function() {
                orientation = EXIF.getTag(this, "Orientation");
                if ((orientation == 1) || (orientation == 2)) {
                    rotation = 0;
                } else if ((orientation == 3) || (orientation == 4)) {
                    rotation = 180;
                } else if ((orientation == 5) || (orientation == 6)) {
                    rotation = -90;
                } else if ((orientation == 7) || (orientation == 8)) {
                    rotation = 90;
                }
            });
            var width = 0;
            var height = 0;
            if ((rotation == 0) || (rotation == 180) || (rotation == -180)) {
                canvas.height = canvas.width * (img.height / img.width);
                canvas2.height = canvas2.width * (img.height / img.width);
                width = canvas.height;
                height = canvas.width;
            } else {
                canvas.height = canvas.width * (img.width / img.height);
                canvas2.height = canvas2.width * (img.width / img.height);
                width = canvas.width;
                height = canvas.height;
            }
            rotation = rotation / 180 * Math.PI;
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(-rotation);
            ctx.drawImage(this, -height/2, -width/2, height, width);
            ctx.restore();
            image_default = ctx.getImageData(0, 0, canvas.width, canvas.height);
            image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx2.putImageData(image, 0, 0);
            counts = countPixels(image);
            if (typeof resetColorChart != 'undefined') {
                resetColorChart(counts);
            }
            $("#controls").collapse("show");
            for (var i in onReset) {
                onReset[i]();
            }
        };

        reader.onload = function(event) {
            the_url = event.target.result
            img.src = the_url;
        }
        reader.readAsDataURL(img_url);
    } catch(err) {
    }
}

var getImgPixelAt = function(img, x, y) {
    let offset = (x + y * img.width)  * 4;
    if ((offset < 0) || (offset > img.data.length)) {
        return null;
    }
    return new Color(img.data[offset], img.data[offset + 1], img.data[offset + 2], img.data[offset + 3]);
}

var setImgPixelAt = function(img, x, y, color) {
    let offset = (x + y * img.width)  * 4;
    if ((offset < 0) || (offset > img.data.length)) {
        return false;
    }
    img.data[offset] = color.r;
    img.data[offset + 1] = color.g;
    img.data[offset + 2] = color.b;
    img.data[offset + 3] = color.a;
    return true;
}