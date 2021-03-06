class PopulationManager {

    population: TriangleSpecimenModel[][] = [];
    maxPop: number = 400;

    mutationRate:  number = 0.25;

    generation: number = 0;

    samplePoints: [number, number][];
    sourceColors: ColorModel[];

    constructor(
        private gdm: DrawingManager, 
        private idm: DrawingManager,
        private workerManager: WorkerManager
    ) {
        
    }

    init(populationSize: number = 400, numSamples: number = 9000, numTriangles: number = 12, mutationRate: number = 0.25) {
        this.maxPop = populationSize;
        
        this.population = [];
        this.generation = 0;
        
        this.samplePoints = PopulationManager.getRandomPoints(numSamples);

        if(!this.sourceColors || !this.sourceColors.length) {
            this.sourceColors = [];
            for(let i = 0; i < this.samplePoints.length; i++) {
                this.sourceColors[i] = this.idm.sampleCanvas(this.samplePoints[i]);
            }
        }

        this.population[0] = this.generateRandomPop(populationSize, numTriangles);
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
                // this.population[this.generation].push(...this.generateRandomPop(10));

                
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
                this.population[this.generation][0].getFitness(this.gdm,this.samplePoints,this.sourceColors);

                console.log(this.population[this.generation][0].fitness/this.samplePoints.length,
                    this.population[this.generation][1].fitness/this.samplePoints.length,
                    this.population[this.generation][this.population[this.generation].length-1].fitness/this.samplePoints.length);
                console.log(this.population[this.generation].length);

                this.generation ++;
                return null;
            }
        )
    }

    private generateRandomPop(num: number = 400, numTriangles: number = 12): TriangleSpecimenModel[] {
        let out: TriangleSpecimenModel[] = [];
        for(let i = 0; i < num; i++) {
            let specimen = new TriangleSpecimenModel(PopulationManager.getRandomTriangles(numTriangles));
            // specimen.clearColor = new ColorModel(Math.random()*255, Math.random()*255, Math.random()*255)
            out.push(specimen)
        }

        return out;
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
            t.color = new ColorModel(Math.random()*255, Math.random()*255, Math.random()*255, 0.5);
            for(let i = 0; i < 3; i++) {
                t.points[i] = MathHelper.getNormalDuad();
                t.points[i][0] *= 0.2;
                t.points[i][0] += 0.5;
                t.points[i][0] = MathHelper.clamp(t.points[i][0], 0, 1);

                t.points[i][1] *= 0.2;
                t.points[i][1] += 0.5;
                t.points[i][1] = MathHelper.clamp(t.points[i][1], 0, 1);
                // t.points[i] = [Math.random(), Math.random()];
            }
            t.forceClockwise();
            triangles.push(t);
        }
    
        return triangles;
    }

}