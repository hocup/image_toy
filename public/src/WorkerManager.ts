class WorkerManager {

    baselineFitnessCanvas(pop: TriangleSpecimenModel[], samplePoints: [number, number][], sourceColors: ColorModel[], gdm: DrawingManager) {
        return new Promise(
            (resolve, reject) => {
                pop.map(
                    (s:TriangleSpecimenModel) => {
                        s.fitness = s.getFitness(gdm,samplePoints,sourceColors);
                    }
                );
                resolve(pop);
            }
        );
    }

    baselineFitnessNoCanvas(pop: TriangleSpecimenModel[], samplePoints: [number, number][], sourceColors: ColorModel[]) {
        return new Promise(
            (resolve, reject) => {
                pop.map(
                    (s: TriangleSpecimenModel) => {
                        s.fitness = s.getFitnessNoCanvas(samplePoints, sourceColors);
                    }
                );
                resolve(pop);
            }
        );
    }

    getFitnessNoReuse(pop: TriangleSpecimenModel[], samplePoints: [number,number][], sourceColors: ColorModel[]) {
        
        let workerPromises = pop.map(
            (s: TriangleSpecimenModel) => {
                return new Promise(
                    (res, rej) => {
                        let wrkr: Worker = new Worker("./workers/js/worker.js");
                        wrkr.addEventListener("message", 
                            (e) => {
                                let msg: FitnessMessageResponse = <FitnessMessageResponse>e.data;
                                s.fitness = msg.fitness;

                                res(s);

                                wrkr.terminate();
                            }
                        );
                        let fm: FitnessMessageModel = new FitnessMessageModel();
                        fm.samplePoints = samplePoints;
                        fm.sourceColors = sourceColors;
                        fm.specimen = s;
                        
                        wrkr.postMessage(fm);
                    }
                );
            }
        );

        return Promise.all(workerPromises);

    }

    workers: Worker[] = [];
    nextWorker: number = 0;

    callbacks: {[key: string] : (f: number) => ISpecimenModel} = {};
    lastCallback: number = 0;

    constructor(numWorkers: number = 8) {
        for(let i = 0; i < numWorkers; i ++) {
            let wrkr: Worker = new Worker("./workers/js/worker.js");
            wrkr.addEventListener("message", 
                (e) => {
                    let msg: FitnessMessageResponse = <FitnessMessageResponse> e.data;
                    
                    if(msg && msg.callbackId && this.callbacks[msg.callbackId]) {
                        this.callbacks[msg.callbackId](msg.fitness);
                        this.callbacks[msg.callbackId] = null;
                    }
                }
            );

            this.workers[i] = wrkr;
        }
    }

    getFitnessReuse(pop: TriangleSpecimenModel[], samplePoints: [number,number][], sourceColors: ColorModel[]) {
        console.log("Have used ",this.lastCallback, "callback functions");
        let workerPromises = pop.map(
            (s: TriangleSpecimenModel) => {
                return new Promise(
                    (resolve, reject) => {
                        let wrkr = this.workers[this.nextWorker];
                        this.nextWorker = (this.nextWorker + 1) % this.workers.length;

                        this.callbacks[(++this.lastCallback) + ""] = 
                            (fitness: number) => { 
                                s.fitness = fitness;
                                resolve(s);
                                return s;
                            }

                        let fm: FitnessMessageModel = new FitnessMessageModel();
                        fm.callbackId = this.lastCallback + "";
                        fm.samplePoints = samplePoints;
                        fm.sourceColors = sourceColors;
                        fm.specimen = s;
                        
                        wrkr.postMessage(fm);
                    }
                )
                
            }
        );

        return Promise.all(workerPromises);
    }
}