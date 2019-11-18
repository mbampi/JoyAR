
let earringSize, earringOffsetX, earringOffsetY = 0;
let necklaceSize, necklaceOffsetX, necklaceOffsetY = 0;
let minPartConfidence = 0.6;

function setProductsScale(videoSize) {
    //if (isMobile() === true) { videoSize = Math.floor(videoSize * 1.6); }
    /* because people on mobile are closer to the screen,
    so the product should appear bigger */

    earringSize = videoSize * 40 / 480;
    earringOffsetX = -(videoSize * 20 / 480); //10
    earringOffsetY = +(videoSize * 10 / 480); //18

    necklaceSize = videoSize * 200 / 480;
    necklaceOffsetX = -(videoSize * 100 / 480);
    necklaceOffsetY = -(videoSize * 50 / 480);
}

class View {

    constructor(screenSize) {
        this.screenSize = screenSize;
        this.productCanvas = document.getElementById('product-canvas');
        this.productCanvas.width = screenSize;
        this.productCanvas.height = screenSize;
        this.productCanvas.style.width = screenSize;
        this.productCanvas.style.height = screenSize;
        this.productCanvasCtx = this.productCanvas.getContext('2d');

        this.imageCanvas = document.getElementById('image-canvas');
        this.imageCanvas.width = screenSize;
        this.imageCanvas.height = screenSize;
        this.imageCanvas.style.width = screenSize;
        this.imageCanvas.style.height = screenSize;
        this.imageCanvasCtx = this.imageCanvas.getContext('2d');

        this.videoInput = document.getElementById('video-input');
        this.videoInput.style.width = screenSize;
        this.videoInput.style.height = screenSize;
        let videoQuality = screenSize;
        let facingMode = "user";
        let constraints = {
            audio: false,
            video: { facingMode: facingMode, width: videoQuality, height: videoQuality }
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function success(stream) {
                let videoIn = document.getElementById('video-input');
                videoIn.height = videoQuality;
                videoIn.width = videoQuality;
                videoIn.srcObject = stream;
                console.log("video atribuido");
            });

        setProductsScale(screenSize);
        this.hideCanvas();
        this.showVideo();
    }

    renderImage(image, flip = false) {
        this.imageCanvasCtx.clearRect(0, 0, this.screenSize, this.screenSize);
        this.imageCanvasCtx.save();

        if (flip) {
            this.imageCanvasCtx.scale(-1, 1);
            this.imageCanvasCtx.translate(-this.screenSize, 0);
        }

        this.imageCanvasCtx.drawImage(image, 0, 0, this.screenSize, this.screenSize);
        this.imageCanvasCtx.restore();
    }

    renderProduct(product, keypoints, flip = false) {
        this.productCanvasCtx.clearRect(0, 0, this.screenSize, this.screenSize);
        this.productCanvasCtx.save();

        if (flip) {
            this.productCanvasCtx.scale(-1, 1);
            this.productCanvasCtx.translate(-this.screenSize, 0);
        }

        this.drawProduct(product, keypoints);
        this.productCanvasCtx.restore();
    }

    async drawProduct(product, keypoints, scale = 1) {
        const leftEarIndex = 3;
        const rightEarIndex = 4;
        const leftShoulderIndex = 5;
        const rightShoulderIndex = 6;

        const productImg = new Image();
        let imagePromise = this.onload2promise(productImg);
        productImg.src = product.img;
        await imagePromise;

        if (product.type = 'earring') {
            let leftEar = keypoints[leftEarIndex];
            let rightEar = keypoints[rightEarIndex];

            if (leftEar.score > minPartConfidence) {
                let x = Math.floor(leftEar.position.x * scale + earringOffsetX);
                let y = Math.floor(leftEar.position.y * scale + earringOffsetY);
                this.productCanvasCtx.drawImage(productImg, x, y, earringSize, earringSize);
            }
            if (rightEar.score > minPartConfidence) {
                let x = Math.floor(rightEar.position.x * scale + earringOffsetX);
                let y = Math.floor(rightEar.position.y * scale + earringOffsetY);
                this.productCanvasCtx.drawImage(productImg, x, y, earringSize, earringSize);
            }

        } else if (product.type = 'necklace') {
            let leftShoulder = keypoints[leftShoulderIndex];
            let rightShoulder = keypoints[rightShoulderIndex];

            if (leftShoulder.score > minPartConfidence && rightShoulder.score > minPartConfidence) {
                let positionX = Math.floor((leftShoulder.position.x + rightShoulder.position.x) / 2);
                let positionY = Math.floor((leftShoulder.position.y + rightShoulder.position.y) / 2);
                let x = positionX * scale + necklaceOffsetX;
                let y = positionY * scale + necklaceOffsetY;

                this.productCanvasCtx.drawImage(productImg, x, y, necklaceSize, necklaceSize);
            }
        }
    }

    onload2promise(img) {
        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    hideVideo() {
        this.videoInput.style.display = "none";
    }

    showVideo() {
        this.videoInput.style.display = "block";
    }

    hideCanvas() {
        this.imageCanvas.style.display = "none";
        this.productCanvas.style.display = "none";
    }

    showCanvas() {
        this.imageCanvas.style.display = "block";
        this.productCanvas.style.display = "block";
    }

}