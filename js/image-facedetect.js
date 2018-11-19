function setGreyscale(img){
    greyscale = [];
    for(let i = 0; i < img.data.length; i+=4){
        greyscale.push((img.data[i] + img.data[i+1] + img.data[i+2])/3);
    }
    return greyscale;
}

function crossImage(img){
    skin = detectSkin(img);
    greyscale = setGreyscale(img);
    crossedImage = [];
    for(let i = 0; i < skin.length; i++){
        crossedImage.push(skin[i] * greyscale[i]);
        // img.data[i*4] = img.data[i*4+1] = img.data[i*4+2] = skin[i] * greyscale[i];
    }
    return crossedImage;
}

function imageLabelling(img){
    crossedImage = crossImage(img);
    var label = [];
    for(let i = 0; i < crossedImage.length; i++){
        if (crossedImage[i] > 90 && crossedImage[i] < 240){
            label.push(1);
        }
        else{
            label.push(0);
        }
    }
    return label;
}

function findFaceObject(img){
    function isLabelSkin(label, skin){
        return (label == 1 && skin == 1);
    }
    label = imageLabelling(img);
    skin = detectSkin(img);
    for(let i = 0; i < skin.length; i++){
        if (isLabelSkin(label[i],skin[i])){
            img.data[i*4] = img.data[i*4+1] = img.data[i*4+2] = 255;
        }
        else{
            img.data[i*4] = img.data[i*4+1] = img.data[i*4+2] = 0;
        }
    }

    return img;
}

