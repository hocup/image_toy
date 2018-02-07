// Couldn't come up with a better class name
class SpecimenModel {
    triangles: TriangleModel[];
    fitness: number;
    // clearColor: ColorModel;

    mutate(mutationRate: number = 0.05, colorShiftScaler: number = 10, positionShiftScaler: number = 0.2){
        this.triangles.forEach(
            (t) => {
                // Tweak the points
                for(let i = 0; i < t.points.length; i++) {
                    if(Math.random() < mutationRate){
                        let shift = MathHelper.getNormalDuad();
                        t.points[i][0] = MathHelper.clamp(positionShiftScaler * shift[0] + t.points[i][0], 0, 1);
                        t.points[i][1] = MathHelper.clamp(positionShiftScaler * shift[1] + t.points[i][1], 0, 1);
                    }
                }

                // Tweak the colors
                if(Math.random() < mutationRate) {
                    ["red","blue","green"].forEach(
                        (c: string) => {
                            let shift = MathHelper.getNormalDuad()[0];
                            (<any>t.color)[c] = MathHelper.clamp((<any>t.color)[c] + shift * colorShiftScaler, 0, 255);
                        }
                    );
                }
            }
        );
    }

    breed(s: SpecimenModel): SpecimenModel[] {
        let out: SpecimenModel[] = [];

        let numOffsprings = 4 + Math.floor(Math.abs(MathHelper.getNormalDuad()[0]));
        for(let i = 0; i < numOffsprings; i++) {
            let offspring = new SpecimenModel();
            offspring.triangles = [];

            //TODO: Handle different numbers of trianglesin the specimens, maybe?
            for(let j = 0; j < this.triangles.length; j++) {
                offspring.triangles[j] = Math.random() > 0.5 ? this.triangles[j].clone() : s.triangles[j].clone();
            }
            out.push(offspring);
        }

        return out;
    }
}