class PopulationManager {

    population: SpecimenModel[][] = [];
    maxPop: number = 400;

    generation: number = 0;

    samplePoints: [number, number][];
    sourceColors: ColorModel[];

    constructor(
        private gdm: DrawingManager, 
        private idm: DrawingManager
    ) {
        
    }

    init() {
        this.samplePoints = PopulationManager.getRandomPoints(9000);
        this.population[0] = this.generateRandomPop();
        this.population[0].forEach(
            (s: SpecimenModel) => {
                s.fitness = this.getFitness(s.triangles);
            }
        );
        this.population[0].sort(
            (sa, sb) => {
                return sb.fitness - sa.fitness;
            }
        );

        this.generation = 1;

        this.gdm.clear();
        let img = this.population[0][0].triangles;
        for(let t in img) {
            this.gdm.drawTriangle(img[t]);
        }
    }

    createNextGeneration(): Promise<null> {
        return new Promise<null>(
            (resolve, reject) => {
                // Create the new sample points
                // this.samplePoints = PopulationManager.getRandomPoints(this.samplePoints.length);

                // Create the new generation's array
                this.population[this.generation] = [];

                // Select the top segment of the previous generation for breeding
                // There is something slightly uncomfortable about my variable naming here
                let breedingStock = this.population[this.generation - 1].slice(0,this.maxPop/6);
                breedingStock.sort((a,b) => {return Math.random() - 0.5;});
                breedingStock.sort((a,b) => {return Math.random() - 0.5;});

                // Create the offsprings
                let offsprings: SpecimenModel[] = [];
                for(let i = 0; i < breedingStock.length/2; i++) {
                    offsprings.push(...breedingStock[i].breed(breedingStock[breedingStock.length-1]));
                }

                // Mutate the offsprings
                offsprings.forEach(
                    (o) => {
                        o.mutate();
                    }
                );

                // Merge the populations
                this.population[this.generation].push(...this.population[this.generation - 1]);
                this.population[this.generation].push(...offsprings);
                this.population[this.generation].push(...this.generateRandomPop(10));

                // Re-compute the fitness
                this.population[this.generation].forEach(
                    (s) => {
                        if(!s.fitness) {
                            s.fitness = this.getFitness(s.triangles);
                        }
                    }
                );
                this.population[this.generation].sort(
                    (sa, sb) => {
                        return sb.fitness - sa.fitness;
                    }
                );
                
                // Cull the population
                this.population[this.generation] = this.population[this.generation].slice(0,this.maxPop);
              

                // Hack to draw the best result soo far
                this.getFitness(this.population[this.generation][0].triangles);
                console.log(this.population[this.generation][0].fitness,
                    this.population[this.generation][1].fitness,
                    this.population[this.generation][this.population[this.generation].length-1].fitness);
                console.log(this.population[this.generation].length);

                this.generation ++;

                // Resolve the promise
                resolve(null);
            }
        );
    }

    private generateRandomPop(num: number = 40): SpecimenModel[] {
        let out: SpecimenModel[] = [];
        for(let i = 0; i < num; i++) {
            let specimen = new SpecimenModel();
            specimen.triangles =  PopulationManager.getRandomTriangles();
            out.push(specimen)
        }

        return out;
    }

    // Assumes the image drawing manager has already drawn the source image
    getFitness(img: TriangleModel[]): number {
        let out = 0;

        this.gdm.clear();
        for(let i = 0; i < img.length; i++) {
            this.gdm.drawTriangle(img[i]);
        }

        if(!this.sourceColors || !this.sourceColors.length) {
            this.sourceColors = [];
            for(let i = 0; i < this.samplePoints.length; i++) {
                this.sourceColors[i] = this.idm.sampleCanvas(this.samplePoints[i]);
            }
        }

        for(let i = 0; i < this.samplePoints.length; i++) {
            let d = this.sourceColors[i].distFrom(this.gdm.sampleCanvas(this.samplePoints[i]));
            out += Math.sqrt(Math.pow(d, 2));
        }

        // Bigger is better, but watch out for divide by zeroe issues
        // if(out == 0) {
        //     return Number.POSITIVE_INFINITY;
        // } else {
        //     return -out;
        // }
        return -out;
    }

    static getRandomPoints = (num: number = 30) => {
        let points: [number, number][] = [];
        for(let i = 0; i < num; i++) {
            points.push([Math.random(), Math.random()]);
        }
        return points;
    }
    
    static getRandomTriangles = (num: number = 5) => {
        let triangles: TriangleModel[] = [];
        for(let i = 0; i < num; i++) {
            let t = new TriangleModel();
            t.color = new ColorModel(Math.random()*255, Math.random()*255, Math.random()*255);
            for(let i = 0; i < 3; i++) {
                t.points[i] = [Math.random(), Math.random()];
            }
            triangles.push(t);
        }
    
        return triangles;
    }

}