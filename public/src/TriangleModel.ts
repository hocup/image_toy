class TriangleModel {
    points: [[number,number], [number,number], [number,number]];
    color: ColorModel;

    constructor() {
        this.points = [[0,0], [0,0], [0,0]];
    }

    clone(): TriangleModel {
        let out = new TriangleModel();
        out.color = this.color.clone();
        for(let i = 0; i < this.points.length; i++) {
            out.points[i][0] = this.points[i][0];
            out.points[i][1] = this.points[i][1];
        }

        return out;
    }

    containsPoint(p:[number, number]): boolean {
        // TODO
        let out = true;


        // for(let i = 0; i < this.points.length; i++) {

        // }

        return out;
    }
}