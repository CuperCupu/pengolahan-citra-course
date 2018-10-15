$(document).ready(function() {

    // File input controls
    $('#button-file-input').click(function() {
        $('#image-file-input').click();
    });

    $('#image-file-input').on('input', function() {
        load_image_file(this.files[0]);
    });

});