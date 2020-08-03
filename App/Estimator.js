
class Estimator {

    constructor(scaleFactor = 0.5, flipHorizontal = false, outputStride = 16) {
        this.api = '';

        this.scaleFactor = scaleFactor; // (0.2 to 1) faster=lower
        this.flipHorizontal = flipHorizontal;
        this.outputStride = outputStride; // (8, 16, 32) faster=higher

        this.lastEstimation = '';
    }

    async init() {
        this.api = await posenet.load();
    }

    async estimatePose(image, flip = false) {
        let pose = await this.api.estimateSinglePose(image, this.scaleFactor, flip, this.outputStride);

        if (flip) { // flip keypoints horizontally
            for (let i = 0; i < pose.keypoints.length; i++) {
                pose.keypoints[i].position.x = image.width - pose.keypoints[i].position.x;
            }
        }

        this.lastEstimation = pose;

        return pose;
    }
}
