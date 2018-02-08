let graphManager: GraphingManager;

window.onload = () => {
    let imageCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('imageCanvas');
    let imageCanvasContext: CanvasRenderingContext2D = imageCanvas.getContext("2d");

    let imageDrawingManager = new DrawingManager(imageCanvasContext, imageCanvas.width, imageCanvas.height);
    imageDrawingManager.clear();
    let imageElement: HTMLImageElement = <HTMLImageElement>document.getElementById("screamImg");
    imageDrawingManager.drawImage(imageElement);

    let generatedCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('generatedCanvas');
    let generatedCanvasContext: CanvasRenderingContext2D = generatedCanvas.getContext("2d");

    let generatedDrawingManager = new DrawingManager(generatedCanvasContext, imageCanvas.width, imageCanvas.height);
    generatedDrawingManager.clear();

    let pm = new PopulationManager(generatedDrawingManager, imageDrawingManager);
    pm.init();

    let graphElement = <HTMLCanvasElement>document.getElementById('fitnessgraph')
    let graphContext = graphElement.getContext('2d');
    graphManager = new GraphingManager(graphContext, graphElement.width, graphElement.height);


    setTimeout(() => {cycleCallback(pm)}, 200);
    // pm.createNextGeneration();

}

let cycleCallback = (pm: PopulationManager, frame: number = 0) => {
    console.log("Working on generation ", pm.generation);
    if(pm.generation < 200) {
        pm.createNextGeneration().then(
            () => {
                let line = pm.population.map(
                    (gen: SpecimenModel[], indx: number): [number, number] => {

                        return [indx, gen[0].fitness + 1000000];
                    }
                );
                graphManager.drawLineGraph(line);

                setTimeout(() => {cycleCallback(pm)}, 1000);
            }
        );
    } else {
        // pm.getFitness(pm.population[frame][0].triangles);
        // setTimeout(() => {cycleCallback(pm, (frame + 1) % 200)}, 200);
    }
}

