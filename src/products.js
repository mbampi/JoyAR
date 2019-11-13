
let minPartConfidence = 0.6;
var currentProduct = { name: "Brinco 1", type: "earring", img: "img/brinco1.png", size: 40, offset: {x: 0, y: 0} };
var currentProductIndex = 2;
var productList = [
  { name: "Brinco 0", type: "earring", img: "img/brinco0.png", size: 40, offset: {x: 0, y: 0} },
  { name: "Colar 0", type: "necklace", img: "img/colar0.png", size: 100, offset: {x: 0, y: 0} },
  { name: "Brinco 1", type: "earring", img: "img/brinco1.png", size: 40, offset: {x: 0, y: 0} },
  { name: "Colar 1", type: "necklace", img: "img/colar1.png", size: 100, offset: {x: 0, y: 0} },
  { name: "Brinco 2", type: "earring", img: "img/brinco2.png", size: 40, offset: {x: 0, y: 0} },
  { name: "Colar 2", type: "necklace", img: "img/colar2.png", size: 100, offset: {x: 0, y: 0} }
];

let productImg = new Image();

let earringSize, earringOffsetX, earringOffsetY = 0;
let necklaceSize, necklaceOffsetX, necklaceOffsetY = 0;

function setProductsScale(videoSize) {
    if (isMobile() === true) { videoSize = Math.floor(videoSize * 1.6); }
    /* because people on mobile are closer to the screen,
    so the product should appear bigger */
    
    earringSize = videoSize * 40 / 480;
    earringOffsetX = -(videoSize * 20 / 480); //10
    earringOffsetY = +(videoSize * 10 / 480); //18

    necklaceSize = videoSize * 200 / 480;
    necklaceOffsetX = -(videoSize * 100 / 480);
    necklaceOffsetY = -(videoSize * 50 / 480);
}

function initiateProduct(videoSize){
  setProductsScale(videoSize);
  currentProductIndex = 0;
  currentProduct = productList[currentProductIndex];
  productImg.src = currentProduct.img;
}

function nextProduct(){
  if(currentProductIndex + 1 < productList.length){
    currentProductIndex += 1;
  } else {
    currentProductIndex = 0;
  }
  currentProduct = productList[currentProductIndex];
  productImg.src = currentProduct.img;
}

function previousProduct(){
  if(currentProductIndex - 1 >= 0){
    currentProductIndex -= 1;
  } else {
    currentProductIndex = productList.length - 1;
  }
  currentProduct = productList[currentProductIndex];
  productImg.src = currentProduct.img;
}


function drawProducts(keypoints, ctx, scale = 1) {
    let shoulders = []

    for (let keypoint of keypoints) {
      if (keypoint.score < minPartConfidence) { continue; }
      let {x, y} = keypoint.position;
  
      if(keypoint.part == "leftEar" || keypoint.part == "rightEar"){
        let adjustedX = Math.floor(x * scale + currentEarring.offset.x);
        let adjustedY = Math.floor(y * scale + currentEarring.offset.y);
        ctx.drawImage(brincoImg, adjustedX, adjustedY, currentEarring.size, currentEarring.size);
      }
      else if(keypoint.part == "leftShoulder" || keypoint.part == "rightShoulder"){
        shoulders.push(keypoint.position);
      }
    }

    if(shoulders.length == 2){
      let x = Math.floor((shoulders[0].x + shoulders[1].x) /2);
      let y = Math.floor((shoulders[0].y + shoulders[1].y) /2);
      let adjustedX = x * scale + currentNecklace.offset.x;
      let adjustedY = y * scale + currentNecklace.offset.y;

      /*let angle = getRotationAngle(shoulders[0].x, shoulders[0].y, shoulders[1].x, shoulders[1].y);
      ctx.rotate(angle);*/

      ctx.drawImage(colarImg, adjustedX, adjustedY, currentNecklace.size, currentNecklace.size);
    }
}

const leftEarIndex = 3;
const rightEarIndex = 4;
const leftShoulderIndex = 5;
const rightShoulderIndex = 6;

function drawProduct(keypoints, ctx, scale = 1) {
  if (currentProduct.type = 'earring'){

    let leftEar = keypoints[leftEarIndex];
    let rightEar = keypoints[rightEarIndex];

    if(leftEar.score > minPartConfidence){
      let adjustedX = Math.floor(leftEar.position.x * scale + earringOffsetX);
      let adjustedY = Math.floor(leftEar.position.y * scale + earringOffsetY);
      ctx.drawImage(productImg, adjustedX, adjustedY, earringSize, earringSize);
    }
    if(rightEar.score > minPartConfidence){
      let adjustedX = Math.floor(rightEar.position.x * scale + earringOffsetX);
      let adjustedY = Math.floor(rightEar.position.y * scale + earringOffsetY);
      ctx.drawImage(productImg, adjustedX, adjustedY, earringSize, earringSize);
    }

  } else if (currentProduct.type = 'necklace'){

    let leftShoulder = keypoints[leftShoulderIndex];
    let rightShoulder = keypoints[rightShoulderIndex];

    if(leftShoulder.score > minPartConfidence && rightShoulder.score > minPartConfidence){
      let x = Math.floor((leftShoulder.position.x + rightShoulder.position.x) /2);
      let y = Math.floor((leftShoulder.position.y + rightShoulder.position.y) /2);
      let adjustedX = x * scale + necklaceOffsetX;
      let adjustedY = y * scale + necklaceOffsetY;

      ctx.drawImage(productImg, adjustedX, adjustedY, necklaceSize, necklaceSize);
    }

  }
}