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


        
        for(let i = 0; out && i < this.points.length; i++) {
            let org = this.points[i];

            let b: [number, number, number] = [p[0] - org[0], p[1] - org[1], 0];
            let a: [number, number, number] = [this.points[(i+1)%this.points.length][0] - org[0], this.points[(i+1)%this.points.length][1] - org[1], 0];

            console.log(a, b, MathHelper.crossProduct(a,b)[2]);

            out = MathHelper.crossProduct(a,b)[2] < 0;
        }

        return out;
    }

    forceClockwise() {
        // If the triangle is not clockwise, make it clockwise by swapping the second and third points
        let a: [number, number, number] = [this.points[1][0] - this.points[0][0],this.points[1][1] - this.points[0][1], 0];
        let b: [number, number, number] = [this.points[2][0] - this.points[1][0],this.points[2][1] - this.points[1][1], 0];

        if(MathHelper.crossProduct(a, b)[2] > 0) {
            // Need to swap the last two points
            let tmp: [number, number] = this.points[1];
            this.points[1] = this.points[2];
            this.points[2] = tmp;
        }
    }

    static fromJsonObj(v: any): TriangleModel {
        let out = new TriangleModel();
        out.points = v.points;
        out.color = new ColorModel(v.color.red, v.color.green, v.color.blue, v.color.alpha);

        return out.clone();
    }
}