
const videoSize = Math.min(window.innerWidth, window.innerHeight);

const net = {
  api: '',
  scaleFactor: 0.5, // (0.2 to 1) faster=lower
  flipHorizontal: false,
  outputStride: 16 // (8, 16, 32) faster=higher
}

var isDisplayingResult = false;

const viewDiv = document.getElementById("view-div");
const view = document.createElement("canvas");
const viewCtx = view.getContext('2d');
viewDiv.appendChild(view);

const inputDiv = document.getElementById('input-div');

const video = document.createElement('video');
viewDiv.appendChild(video);

croppedButton = document.createElement('button');
croppedButton.innerText = "Pronto";
inputDiv.appendChild(croppedButton);

// -- MAIN
const cropper = addCropper();
setTakePictureButton();
setUploadPictureButton();
loadVideo();
setProductsScale(videoSize);


/* ---- Functions ---- */

function addCropper(){
  let opts = {
    viewport: { width: videoSize*0.8, height: videoSize*0.8, type: 'square' },
    boundary: { width: videoSize, height: videoSize },
    showZoomer: true,
    enableOrientation: true
  }
  
  return new Croppie(inputDiv, opts);
}

function setTakePictureButton() {
  let takePictureButton = document.createElement("button");
  takePictureButton.innerText = "Tirar Foto";
  takePictureButton.style.marginTop = videoSize+"px";
  takePictureButton.style.width = videoSize+"px";
  takePictureButton.style.height = "50px";

  let buttonsDiv = document.getElementById("buttons-div");
  buttonsDiv.appendChild(takePictureButton);

  takePictureButton.addEventListener("click", function() {
    view.width = videoSize;
    view.height = videoSize;

    if (isDisplayingResult) {
      video.style.display = "block";
      isDisplayingResult = false;
    }
    else {
      renderView(video, flip=true)
      video.style.display = "none";
      isDisplayingResult = true;
    }
  });
}

function setUploadPictureButton() {
  let uploadPictureButton = document.createElement("input");
  uploadPictureButton.setAttribute('id', 'picture-upload');
  uploadPictureButton.setAttribute('type', 'file');
  uploadPictureButton.setAttribute('accept', 'image/*');
  uploadPictureButton.innerText = "Carregar Foto";
  uploadPictureButton.style.marginTop = (videoSize+50)+"px";
  uploadPictureButton.style.width = videoSize+"px";
  uploadPictureButton.style.height = "50px";

  let buttonsDiv = document.getElementById("buttons-div");
  buttonsDiv.appendChild(uploadPictureButton);

  const pictureInput = document.getElementById('picture-upload');
  pictureInput.addEventListener('change', (e) => readFile(e.target.files[0]));
}

function readFile(file){
  let reader = new FileReader();
    
  reader.onloadend = function () {
    console.log('picture loaded');
    processFile(reader.result);
    video.style.display = "none";
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
    
    croppedButton.onclick = function() {
      view.width = videoSize;
      view.height = videoSize;
      viewDiv.style.height = videoSize;
      viewDiv.style.width = videoSize;

      cropper.result({type: 'rawcanvas', size: {width: videoSize, height: videoSize} })
        .then(function(canvas){ 
          renderView(canvas); 
        });
    };
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
    changeNecklace(1);
    changeEarring(1);
  });
}

async function renderView(image, flip=false){
  viewCtx.clearRect(0, 0, videoSize, videoSize);
  viewCtx.save();

  if (flip) {
    viewCtx.scale(-1, 1);
    viewCtx.translate(-videoSize, 0);
  }

  viewCtx.drawImage(image, 0, 0, videoSize, videoSize);

  console.time("TensorflowRequest");
  let pose = await estimatePose(image);
  console.timeEnd("TensorflowRequest");
  drawProducts(pose.keypoints, viewCtx);

  viewCtx.restore();
}

async function estimatePose(image){
  let pose = await net.api.estimateSinglePose(image, net.scaleFactor, net.flipHorizontal, net.outputStride);

  return pose;
}
