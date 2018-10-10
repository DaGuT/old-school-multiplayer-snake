//Values for segment configuration. Individual for each client. Will be set up in sketch => setup
let segmentHeight;
let segmentWidth;

class Snake {
    static draw(segments) {
        fill(255);
        segments.forEach((segment) => {
            rect(segment.x*segmentWidth, segment.y*segmentHeight, segmentWidth, segmentHeight);
        })
    }
}
