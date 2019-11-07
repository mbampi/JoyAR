
const videoSize = Math.min(window.innerWidth, window.innerHeight);

var net = "";
const posenetConfig = {
  scaleFactor: 0.5, // (0.2 to 1) faster=lower
  flipHorizontal: false,
  outputStride: 16 // (8, 16, 32) faster=higher
}

var isDisplayingResult = false;

const viewDiv = document.getElementById("view");
const view = document.createElement("canvas");
const viewCtx = view.getContext('2d');
viewDiv.appendChild(view);

const video = document.createElement('video');
viewDiv.appendChild(video);


// -- MAIN
setTakePictureButton();
loadVideo();
setProductsScale(videoSize);


/* ---- Functions ---- */

function setTakePictureButton() {
  let takePictureButton = document.createElement("button");
  takePictureButton.innerText = "Tirar Foto";
  takePictureButton.style.marginTop = videoSize+"px";
  takePictureButton.style.width = videoSize+"px";
  takePictureButton.style.height = "50px";

  let screenshotDiv = document.getElementById("screenshots");
  screenshotDiv.appendChild(takePictureButton);

  takePictureButton.addEventListener("click", function() {
    view.width = videoSize;
    view.height = videoSize;

    if(isDisplayingResult) {
      video.style.display = "block";
      isDisplayingResult = false;
    }
    else {
      renderView()
      video.style.display = "none";
      isDisplayingResult = true;
    }
  });
}

function loadVideo(){
  console.log("loading video..");

  video.style.display = "block";
  video.style.margin = "0 auto";
  video.style.width = videoSize + "px";
  video.style.height = videoSize + "px";
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('loop', '');

  let videoQuality = videoSize;
  let facingMode = "user";
  let constraints = {
    audio: false,
    video: { facingMode: facingMode, width: videoQuality, height: videoQuality }
  }
  navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.height = videoQuality;
    video.width = videoQuality;
    video.srcObject = stream;
    console.log("video atribuido");

    loadPosenet();
  });
}

function loadPosenet(){
  posenet.load().then(function(loadedPosenet) {
    net = loadedPosenet;
    console.log("loaded Posenet");
    changeNecklace(1);
    changeEarring(1);
  });
}

async function renderView(){
  console.time("TensorflowRequest");
  let pose = await estimatePose(video)
  console.timeEnd("TensorflowRequest");

  viewCtx.clearRect(0, 0, videoSize, videoSize);
  viewCtx.save();
  viewCtx.scale(-1, 1);
  viewCtx.translate(-videoSize, 0);

  viewCtx.drawImage(video, 0, 0, videoSize, videoSize);

  drawProducts(pose.keypoints, viewCtx);

  viewCtx.restore();
}

async function estimatePose(image){
  let pose = await net.estimateSinglePose(image, posenetConfig.scaleFactor, posenetConfig.flipHorizontal, posenetConfig.outputStride);

  return pose;
}
