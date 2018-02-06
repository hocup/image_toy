class ColorModel {
    constructor(
        private red: number = 0,
        private green: number = 0,
        private blue: number = 0,
        private alpha: number = 0.9
    ){}

    toString(){
        let out = "";
        out += "rgba( ";
        out += Math.floor(this.red) + ",";
        out += Math.floor(this.green) + ",";
        out += Math.floor(this.blue) + ",";
        out += this.alpha + ")";

        return out;
    }

    distFrom(c: ColorModel): number {
        return Math.sqrt(Math.pow(c.red - this.red, 2) + Math.pow(c.green - this.green, 2) + Math.pow(c.blue - this.blue, 2));
    }

    clone(): ColorModel {
        return new ColorModel(this.red, this.green, this.blue, this.alpha);
    }
}