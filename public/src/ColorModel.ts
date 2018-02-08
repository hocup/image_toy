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

    add(c: ColorModel): void {
        // Assumes this color already has alpha of 1 
        this.red = Math.floor(c.alpha * c.red + (1 - c.alpha) * this.red);
        this.green = Math.floor(c.alpha * c.green + (1 - c.alpha) * this.green);
        this.blue = Math.floor(c.alpha * c.blue + (1 - c.alpha) * this.blue);
    }
}