
let minPartConfidence = 0.6;

var currentEarring = { name: "Brinco 1", type: "earring", img: "img/brinco1.png", size: 40, offset: {x: 0, y: 0} };
var currentNecklace = { name: "Colar 1", type: "necklace", img: "img/coalr1.png", size: 100, offset: {x: 0, y: 0} };

let brincoImg = new Image();
let colarImg = new Image();
brincoImg.onload = function() { document.getElementById('brinco').setAttribute('src', this.src); };
colarImg.onload = function() { document.getElementById('colar').setAttribute('src', this.src); };


function setProductsScale(videoSize) {
    if (isMobile() === true) { videoSize = Math.floor(videoSize * 1.6); }
    /* because people on mobile are closer to the screen,
    so the product should appear bigger */
    
    currentEarring.size = videoSize * 40 / 480;
    currentEarring.offset.x = -(videoSize * 20 / 480); //10
    currentEarring.offset.y = +(videoSize * 10 / 480); //18

    currentNecklace.size = videoSize * 200 / 480;
    currentNecklace.offset.x = -(videoSize * 100 / 480);
    currentNecklace.offset.y = -(videoSize * 50 / 480);
}

function changeEarring(model){
    brincoImg.src = 'img/brinco' + model + '.png';
}

function changeNecklace(model){
    colarImg.src = 'img/colar' + model + '.png';
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
