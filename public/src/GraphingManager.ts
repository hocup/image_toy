// A small class to throw a line graph onto a canvas
class GraphingManager {
    clearColor: ColorModel = new ColorModel(255,255,255,1);
    lineColor: ColorModel = new ColorModel(0,0,255,1);

    constructor(
        public drawingContext: CanvasRenderingContext2D,
        public drawWidth: number,
        public drawHeight: number,
        public xmin: number = 0,
        public xmax: number = 200,
        public ymin: number = 0,
        public ymax: number = 1000000
    ) {}

    drawLineGraph(values: [number, number][], autoScale: boolean = true) {
        // If autoscale is true, change the manager's min and max settings
            // TODO: Can handle this with just one pass through the array, rather than four
            if(autoScale) {
                this.xmin = Math.min(...values.map(d => d[0]));
                this.xmax = Math.max(...values.map(d => d[0]));
                this.ymin = Math.min(...values.map(d => d[1]));
                this.ymax = Math.max(...values.map(d => d[1]));
            }
        
        // Scale and translate the values to fit in the canvas
        let transformedLine = values.map(
            (p: [number, number]) : [number, number] => {
                let out: [number, number] = [0,0];
                out[0] = (p[0] - this.xmin) * this.drawWidth / (this.xmax - this.xmin);
                out[1] = this.drawHeight - ((p[1] - this.ymin) * this.drawHeight / (this.ymax - this.ymin));
                return out;
            }
        ) 
        
        // Clear the canvas and set the line style
        this.drawingContext.fillStyle = this.clearColor.toString();
        this.drawingContext.fillRect(0,0,this.drawWidth, this.drawHeight);

        this.drawingContext.strokeStyle= this.lineColor.toString();

        // Assume the values are sorted appropriately and draw the lines
        this.drawingContext.beginPath();
        this.drawingContext.moveTo(transformedLine[0][0],transformedLine[0][1]);

        for(let i = 1; i < transformedLine.length; i++) {
            this.drawingContext.lineTo(transformedLine[i][0],transformedLine[i][1]);
        }

        this.drawingContext.stroke();
    }

}