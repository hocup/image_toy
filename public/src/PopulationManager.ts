class PopulationManager {

    workerManager: WorkerManager;

    population: TriangleSpecimenModel[][] = [];
    maxPop: number = 400;

    mutationRate:  number = 0.25;

    generation: number = 0;

    samplePoints: [number, number][];
    sourceColors: ColorModel[];

    constructor(
        private gdm: DrawingManager, 
        private idm: DrawingManager
    ) {
        this.workerManager = new WorkerManager();
    }

    init() {
        this.population = [];
        this.generation = 0;

        this.samplePoints = PopulationManager.getRandomPoints(9000);

        if(!this.sourceColors || !this.sourceColors.length) {
            this.sourceColors = [];
            for(let i = 0; i < this.samplePoints.length; i++) {
                this.sourceColors[i] = this.idm.sampleCanvas(this.samplePoints[i]);
            }
        }

        this.population[0] = this.generateRandomPop();
        this.population[0].forEach(
            (s: TriangleSpecimenModel) => {
                s.fitness = s.getFitness(this.gdm, this.samplePoints, this.sourceColors)
            }
        );
        this.population[0].sort(
            (sa, sb) => {
                return sb.fitness - sa.fitness;
            }
        );

        this.generation = 1;

        this.gdm.clear();
        this.population[0][0].getFitness(this.gdm, this.samplePoints, this.sourceColors)
    }

    createNextGeneration(): Promise<null> {
        let start: number = new Date().getTime();
        return new Promise<any>(
            (resolve, reject) => {
                // Create the new sample points
                // this.samplePoints = PopulationManager.getRandomPoints(this.samplePoints.length);
                if(!this.sourceColors || !this.sourceColors.length) {
                    this.sourceColors = [];
                    for(let i = 0; i < this.samplePoints.length; i++) {
                        this.sourceColors[i] = this.idm.sampleCanvas(this.samplePoints[i]);
                    }
                }

                // Create the new generation's array
                this.population[this.generation] = [];

                // Select the top segment of the previous generation for breeding
                // There is something slightly uncomfortable about my variable naming here
                let breedingStock = this.population[this.generation - 1].slice(0,this.maxPop);
                breedingStock.sort((a,b) => {return Math.random() - 0.5;});
                breedingStock.sort((a,b) => {return Math.random() - 0.5;});

                // Create the offsprings
                let offsprings: TriangleSpecimenModel[] = [];
                for(let i = 0; i < breedingStock.length/2; i++) {
                    offsprings.push(...breedingStock[i].breed(breedingStock[breedingStock.length-1]));
                }

                // Mutate the offsprings
                offsprings.forEach(
                    (o) => {
                        o.mutate(this.mutationRate);
                    }
                );

                // Merge the populations
                this.population[this.generation].push(...this.population[this.generation - 1]);
                this.population[this.generation].push(...offsprings);
                this.population[this.generation].push(...this.generateRandomPop(10));

                
                // Re-compute the fitness
                // resolve(this.workerManager.baselineFitnessCanvas(this.population[this.generation], this.samplePoints, this.sourceColors, this.gdm));
                // resolve(this.workerManager.baselineFitnessNoCanvas(this.population[this.generation], this.samplePoints, this.sourceColors));
                resolve(this.workerManager.getFitnessReuse(this.population[this.generation], this.samplePoints, this.sourceColors));
                
            }
        ).then(
            (p) => {
                console.log("beep", new Date().getTime() - start);

                this.population[this.generation].sort(
                    (sa, sb) => {
                        return sb.fitness - sa.fitness;
                    }
                );
                
                // Cull the population
                this.population[this.generation] = this.population[this.generation].slice(0,this.maxPop);
              
                

                // Hack to draw the best result soo far
                this.population[this.generation][0].getFitness(this.gdm,this.samplePoints,this.sourceColors)
                console.log(this.population[this.generation][0].fitness,
                    this.population[this.generation][1].fitness,
                    this.population[this.generation][this.population[this.generation].length-1].fitness);
                console.log(this.population[this.generation].length);

                this.generation ++;
                return null;
            }
        )
    }

    private generateRandomPop(num: number = 40): TriangleSpecimenModel[] {
        let out: TriangleSpecimenModel[] = [];
        for(let i = 0; i < num; i++) {
            let specimen = new TriangleSpecimenModel(PopulationManager.getRandomTriangles());
            out.push(specimen)
        }

        return out;
    }

    // Assumes the image drawing manager has already drawn the source image
    getFitness(img: TriangleModel[]): number {
        let start = window.performance.now();
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

        

        // console.log("Get fitness finished in ", window.performance.now() - start);
        return -out;
    }

    static getRandomPoints = (num: number = 30) => {
        let points: [number, number][] = [];
        for(let i = 0; i < num; i++) {
            points.push([Math.random(), Math.random()]);
        }
        return points;
    }
    
    static getRandomTriangles = (num: number = 15) => {
        let triangles: TriangleModel[] = [];
        for(let i = 0; i < num; i++) {
            let t = new TriangleModel();
            t.color = new ColorModel(Math.random()*255, Math.random()*255, Math.random()*255, 0.5);
            for(let i = 0; i < 3; i++) {
                t.points[i] = [Math.random(), Math.random()];
            }
            t.forceClockwise();
            triangles.push(t);
        }
    
        return triangles;
    }

}