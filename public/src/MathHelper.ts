class MathHelper {

    static getNormalDuad(): [number, number] {
        //Box-Muller method straight from wikipedia

        let u1: number = Math.random();
        let u2: number = Math.random();

        let z0: number = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
        let z1: number = Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2);

        return [z0, z1];
    }

    static clamp(v: number, min: number, max: number): number {
        if(v > max) {
            return max;
        } else if(v < min){
            return min;
        } else {
            return v;
        }        
    }

    static crossProduct(a: [number, number, number], b: [number, number, number]) {
        let out: [number, number, number] = [0,0,0];

        out[0] = a[1]*b[2] - a[2]*b[1];
        out[1] = - a[0]*b[2] + a[2]*b[0];
        out[2] = a[0]*b[1] - a[1]*b[0];

        return out;
    }
}