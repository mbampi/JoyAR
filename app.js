var net = "";
const scaleFactor = 1; //0.50
const flipHorizontal = false;
const outputStride = 16;

var viewDiv = document.getElementById("view");
var view = document.createElement("canvas");
var viewCtx = view.getContext('2d');
viewDiv.appendChild(view);

var isDisplayingResult = false;
var video = document.createElement('video');
document.body.appendChild(video);
var videoSize = Math.min(window.innerWidth, window.innerHeight);

/* Earring/Necklace */
var brinco = new Image();
var colar = new Image();
brinco.onload = function () {
  document.getElementById('brinco').setAttribute('src', this.src);
};
colar.onload = function () {
  document.getElementById('colar').setAttribute('src', this.src);
};

const earringSize = videoSize * 40 / 480;
const necklaceSize = videoSize * 200 / 480;
const necklaceOffsetX = -(videoSize * 100 / 480);
const necklaceOffsetY = -(videoSize * 50 / 480);
const earringOffsetX = -(videoSize * 20 / 480); //10
const earringOffsetY = +(videoSize * 10 / 480); //18

function changeEarring(model){
  brinco.src = 'img/brinco' + model + '.png';
}
function changeNecklace(model){
  colar.src = 'img/colar' + model + '.png';
}


// Tirar Foto
var takePicture = document.createElement("button");
takePicture.innerText = "Tirar Foto";
takePicture.style.width = "250px";
takePicture.style.height = "150px";
document.body.appendChild(takePicture);

takePicture.addEventListener("click", function() {
  view.width = videoSize;
  view.height = videoSize;
  /*view.style.width = 200+"px";
  view.style.height = 200+"px";*/
  if(isDisplayingResult){
    video.style.display = "block";
    isDisplayingResult = false;
  }else{
    renderView()
    isDisplayingResult = true;
  }
});

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

  let facingMode = "user";
  let constraints = {
    audio: false,
    video: { facingMode: facingMode, width: videoSize, height: videoSize }
  }
  navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
    video.height = videoSize;
    video.width = videoSize;
    video.srcObject = stream;
    console.log("video atribuido");

    loadPosenet();
  });
}
loadVideo();

view.width = videoSize;
view.height = videoSize;
function loadPosenet(){
  posenet.load().then(function(loadedPosenet) {
    net = loadedPosenet;
    console.log("loaded Posenet");
    changeNecklace(1);
    changeEarring(1);
  });
}

async function renderView(){
  let minConfidence = 0.6;
  const pose = await net.estimateSinglePose(video, scaleFactor, flipHorizontal, outputStride);

  viewCtx.clearRect(0, 0, videoSize, videoSize);
  viewCtx.save();
  viewCtx.scale(-1, 1);
  viewCtx.translate(-videoSize, 0);
  
  video.style.display = "none";
  viewCtx.drawImage(video, 0, 0, videoSize, videoSize);

  drawProducts(pose.keypoints, minConfidence, viewCtx);
  viewCtx.restore();
}

function drawProducts(keypoints, minConfidence, ctx, scale = 1, size=1) {
    let shoulders = []

    for (keypoint of keypoints) {
      console.log(keypoint);
      if (keypoint.score < minConfidence) { continue; }
      const {x, y} = keypoint.position;
  
      if(keypoint.part == "leftEar" || keypoint.part == "rightEar"){
        //drawPoint(ctx, x * scale, y * scale, 3);
        let adjustedX = Math.floor(x*scale+earringOffsetX);
        let adjustedY = Math.floor(y*scale+earringOffsetY);
        ctx.drawImage(brinco, adjustedX, adjustedY, earringSize*size, earringSize*size);
      }
      else if(keypoint.part == "leftShoulder" || keypoint.part == "rightShoulder"){
        shoulders.push(keypoint.position);
      }
    }

    if(shoulders.length == 2){
      const x = Math.floor((shoulders[0].x + shoulders[1].x) /2);
      const y = Math.floor((shoulders[0].y + shoulders[1].y) /2);
      let adjustedX = x * scale + necklaceOffsetX;
      let adjustedY = y * scale + necklaceOffsetY;
      //drawPoint(ctx, x * scale, y * scale, 3);

      /*let angle = getRotationAngle(shoulders[0].x, shoulders[0].y, shoulders[1].x, shoulders[1].y);
      ctx.rotate(angle);*/

      ctx.drawImage(colar, adjustedX, adjustedY, necklaceSize*size, necklaceSize*size);
    }
}