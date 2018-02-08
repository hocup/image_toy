class DrawingManager {
    clearColor: ColorModel = new ColorModel(122,122,122,1);
    perObjectOpacity: 0.3;

    constructor(
        private imageContext: CanvasRenderingContext2D,
        private width: number,
        private height: number
    ) {
        
    }
    
    clear(clearColor: ColorModel = null) {
        if(clearColor == null) {
            this.imageContext.fillStyle = this.clearColor.toString();
        } else {
            this.imageContext.fillStyle = clearColor.toString();
        }
        
        this.imageContext.fillRect(0,0,this.width,this.height);
    }

    drawTriangle(t: TriangleModel){
        // set the fill style
        this.imageContext.fillStyle = t.color.toString();

        this.imageContext.beginPath();
        // move to start
        this.imageContext.moveTo(t.points[0][0] * this.width, t.points[0][1] * this.height);

        // lines to the next two points
        for(let i = 1; i < t.points.length; i++) {
            this.imageContext.lineTo(this.width * t.points[i][0], this.height * t.points[i][1])
        }

        // fill the polygon
        this.imageContext.fill();
    }

    drawImage(image: HTMLImageElement) {
        this.imageContext.drawImage(image, 0,0);
    }

    sampleCanvas(p:[number, number]): ColorModel {
        let imgDat = this.imageContext.getImageData(Math.floor(p[0]*this.width),Math.floor(p[1]*this.height),1,1);

        return new ColorModel(imgDat.data[0], imgDat.data[1], imgDat.data[2], imgDat.data[3]/255);
    }
}