$(document).ready(function() {

    // Webcam controls
    $('#button-webcam-start').click(function() {
        startWebcam();
        $('#button-webcam-start').addClass('d-none');
    });
    $('#button-webcam-snapshot').click(function() {
        snapshot();
    });
    $('#button-webcam-stop').click(function() {
        stopWebcam();
        $('#button-webcam-start').removeClass('d-none');
        $('#webcam-control').addClass('d-none');
    });

    // File input controls
    $('#button-file-input').click(function() {
        $('#image-file-input').click();
    });

    $('#image-file-input').on('input', function() {
        load_image_file(this.files[0]);
    });
});