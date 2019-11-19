
/* -- MAIN -- */

let isDisplayingResult = false;
let viewSize = Math.min(window.innerWidth, window.innerHeight);

const view = new View(viewSize);

const estimator = new Estimator();
estimator.init();

const app = new App(viewSize);

const cropper = addCropper();


// --- EVENT LISTENERS

view.productCanvas.onclick = (mouse) => {
  if (isDisplayingResult === true) {
    let x = mouse.x - document.getElementById('canvas-container').offsetLeft;
    if (x < view.productCanvas.width / 2) {
      console.log("<-");
      app.previousProduct();
    } else {
      console.log("->");
      app.nextProduct();
    }

    view.renderProduct(app.currentProduct, estimator.lastEstimation.keypoints);
    updateStore(app.currentProduct);
  }
};

document.getElementById("take-picture").onclick = function () {
  if (isDisplayingResult) {
    view.hideCanvas();
    view.showVideo();
    isDisplayingResult = false;
  }
  else {
    renderView(view.videoInput, flip = true);
    view.showCanvas();
    view.hideVideo();
    isDisplayingResult = true;
  }
}

document.getElementById('download-button').onclick = function (event) {
  let downloadButton = document.getElementById('download-button');
  downloadButton.href = view.imageCanvas.toDataURL('image/png');
  downloadButton.download = "joyarIMG.png";
}

document.getElementById("upload-picture").onchange = (e) => readFile(e.target.files[0]);


async function renderView(image) {
  let flip = false;
  if (image.tagName == 'VIDEO') { flip = true };

  view.showCanvas();
  view.hideVideo();
  view.renderImage(image, flip);

  console.time("TensorflowRequest");
  let pose = await estimator.estimatePose(image, flip);
  console.timeEnd("TensorflowRequest");

  view.renderProduct(app.currentProduct, pose.keypoints);
  updateStore(app.currentProduct);
}

// --- UPLOAD PICTURE AND OVERLAY ---

function addCropper() {
  let overlayDiv = document.getElementById('overlay-div');

  let opts = {
    viewport: { width: viewSize * 0.7, height: viewSize * 0.7, type: 'square' },
    boundary: { width: viewSize * 0.8, height: viewSize * 0.8 },
    showZoomer: true,
    enableOrientation: true
  }
  let croppie = new Croppie(overlayDiv, opts);

  document.getElementById('rotate-left').onclick = () => croppie.rotate(-90);
  document.getElementById('rotate-right').onclick = () => croppie.rotate(90);

  document.getElementById('ready-image').onclick = () => {
    croppie.result({ type: 'rawcanvas', size: { width: viewSize, height: viewSize } })
      .then((canvas) => {
        overlayOff();
        renderView(canvas);
      });
  }
  return croppie;
}

function readFile(file) {
  let reader = new FileReader();

  reader.onloadend = function () {
    console.log('picture loaded');
    processFile(reader.result);
    view.showCanvas();
    view.hideVideo();
    isDisplayingResult = true;
  }

  reader.onerror = function () { alert('Erro ao ler a imagem!'); }

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

function overlayOn() {
  document.getElementById("overlay-div").style.display = "block";
}

function overlayOff() {
  document.getElementById("overlay-div").style.display = "none";
}

function isMobile() {
  let isThisMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)));

  console.log("isMobile?" + isThisMobile);
  return isThisMobile;
}

function updateStore(product) {
  document.getElementById('product-name').innerHTML = product.name;
  document.getElementById('product-price').innerHTML = product.price;
  // document.getElementById('product-description') = product.description;
  document.getElementById('product-img').src = product.img;
}