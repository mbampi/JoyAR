
const videoSize = Math.min(window.innerWidth, window.innerHeight);
var lastKeypoints = null;

const net = {
  api: '',
  scaleFactor: 0.5, // (0.2 to 1) faster=lower
  flipHorizontal: false,
  outputStride: 16 // (8, 16, 32) faster=higher
}

var isDisplayingResult = false;

const viewDiv = document.getElementById("view-div");
//const view = document.createElement("canvas");
const view = document.getElementById("image-canvas");
const productCanvas = document.getElementById("product-canvas");

const viewCtx = view.getContext('2d');

productCanvas.onclick = function(mouse){
  let x = mouse.x - view.offsetLeft;
  
  if (x < view.width/2) {
    console.log("<-");
    previousProduct();
  } else { 
    console.log("->");
    nextProduct();
  }
  renderProduct(lastKeypoints);
}

const video = document.createElement('video');
viewDiv.appendChild(video);


/* -- MAIN -- */
const cropper = addCropper();
setTakePictureButton();
setUploadPictureButton();
loadVideo();


/* ---- Functions ---- */

function addCropper(){
  let overlayDiv = document.getElementById('overlay-div');

  let opts = {
    viewport: { width: videoSize*0.7, height: videoSize*0.7, type: 'square' },
    boundary: { width: videoSize*0.8, height: videoSize*0.8 },
    showZoomer: true,
    enableOrientation: true
  }
  let croppie = new Croppie(overlayDiv, opts);

  let rotateLeftButton = document.getElementById('rotate-left');
  rotateLeftButton.onclick = function() { cropper.rotate(-90) };
  let rotateRightButton = document.getElementById('rotate-right');
  rotateRightButton.onclick = function() { cropper.rotate(90) };

  let readyImageButton = document.getElementById('ready-image');
  readyImageButton.onclick = function() {
    view.width = videoSize;
    view.height = videoSize;
    viewDiv.style.height = videoSize;
    viewDiv.style.width = videoSize;
  
    cropper.result({type: 'rawcanvas', size: {width: videoSize, height: videoSize} })
      .then(function(canvas){
        overlayOff();
        renderView(canvas); 
      });
  }
  
  return croppie;
}

function setTakePictureButton() {
  let takePictureButton = document.getElementById("take-picture");

  takePictureButton.addEventListener("click", function() {
    view.width = videoSize;
    view.height = videoSize;
    productCanvas.width = videoSize;
    productCanvas.height = videoSize;
    
    if (isDisplayingResult) {
      view.style.display = "none";
      productCanvas.style.display = "none";
      video.style.display = "block";
      isDisplayingResult = false;
    }
    else {
      renderView(video, flip=true)
      view.style.display = "block";
      productCanvas.style.display = "block";
      video.style.display = "none";
      isDisplayingResult = true;
    }
  });
}

function setUploadPictureButton() {
  let uploadPicture = document.getElementById("upload-picture");
  let buttonsDiv = document.getElementById("buttons-div");
  buttonsDiv.appendChild(uploadPicture);

  uploadPicture.addEventListener('change', (e) => readFile(e.target.files[0]));
}

function readFile(file){
  let reader = new FileReader();
    
  reader.onloadend = function () {
    console.log('picture loaded');
    processFile(reader.result);
    video.style.display = "none";
    view.style.display = "block";
    productCanvas.style.display = "block";
    isDisplayingResult = true;
  }

  reader.onerror = function () { alert('Erro ao ler a imagem!');  }

  reader.readAsDataURL(file);
}

function processFile(dataURL) {
  let image = new Image();
  image.src = dataURL;
  
  image.onload = function () { 
    cropper.bind({ url: dataURL });
    overlayOn();
  };

	image.onerror = function () { alert('Erro ao carregar a imagem!'); };
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
    net.api = loadedPosenet;
    console.log("loaded Posenet");
    initiateProduct(videoSize);
  });
}

async function renderView(image, flip=false){
  renderImage(image);

  console.time("TensorflowRequest");
  let pose = await estimatePose(image);
  console.timeEnd("TensorflowRequest");

  renderProduct(pose.keypoints);
}

function renderImage(image){
  viewCtx.clearRect(0, 0, videoSize, videoSize);
  viewCtx.save();
  //if (flip) {
    viewCtx.scale(-1, 1);
    viewCtx.translate(-videoSize, 0);
  //}
  viewCtx.drawImage(image, 0, 0, videoSize, videoSize);
  viewCtx.restore();
}

function renderProduct(keypoints){
  let productLayer = productCanvas.getContext('2d');
  productLayer.clearRect(0, 0, videoSize, videoSize);
  //if (flip) {
    productLayer.scale(-1, 1);
    productLayer.translate(-videoSize, 0);
  //}
  drawProduct(keypoints, productLayer);
  lastKeypoints = keypoints;
}

async function estimatePose(image){
  let pose = await net.api.estimateSinglePose(image, net.scaleFactor, net.flipHorizontal, net.outputStride);

  return pose;
}


function overlayOn() {
  document.getElementById("overlay-div").style.display = "block";
}

function overlayOff() {
  document.getElementById("overlay-div").style.display = "none";
}