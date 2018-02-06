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
    setTimeout(() => {cycleCallback(pm)}, 200);

}

let cycleCallback = (pm: PopulationManager, frame: number = 0) => {
    console.log("Working on generation ", pm.generation);
    if(pm.generation < 200) {
        pm.createNextGeneration().then(
            () => {
                setTimeout(() => {cycleCallback(pm)}, 1000);
            }
        );
    } else {
        pm.getFitness(pm.population[frame][0].triangles);
        setTimeout(() => {cycleCallback(pm, (frame + 1) % 200)}, 200);
    }
}

