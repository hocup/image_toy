let graphManager: GraphingManager;
let urlParams: {[key: string]: string}
let maxGeneration: number = 200;

window.onload = () => {
    // Copy-pasted from stack overflow, like all the best code
    // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript#2880929

    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s: string) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);

    console.log(urlParams);
    if(urlParams.file) {
        console.log("Should make an image with file ", urlParams.file);
        let imgContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("imgContainer");
        let newImg: HTMLImageElement = document.createElement("img");
        newImg.id = "myImg";
        newImg.src = "./uploads/" + urlParams.file;
        newImg.onload = startGenerator;
        imgContainer.appendChild(newImg);
    }
}

let startGenerator = () => {
    let imageElement: HTMLImageElement = <HTMLImageElement>document.getElementById("myImg");
    
    console.log(imageElement.width, imageElement.height);

    let maxDimension: number = 200;
    let scaleBy = imageElement.width > imageElement.height ?  maxDimension/imageElement.width  : maxDimension/imageElement.height ;

    let ch: number = imageElement.height*scaleBy;
    let cw: number =  imageElement.width*scaleBy;

    let imageCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('imageCanvas');
    imageCanvas.width = cw;
    imageCanvas.height = ch;
    let imageCanvasContext: CanvasRenderingContext2D = imageCanvas.getContext("2d");

    let imageDrawingManager = new DrawingManager(imageCanvasContext, imageCanvas.width, imageCanvas.height);
    imageDrawingManager.clear();
    imageDrawingManager.drawImage(imageElement);

    
    // TODO: Prepopulate the input fields

    // TODO: Apply blur
    // let imdat = imageCanvasContext.getImageData(0,0,imageCanvas.width, imageCanvas.height);
    // let newDat = new ImageData(imageCanvas.width, imageCanvas.height);

    let generatedCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('generatedCanvas');
    generatedCanvas.width = cw;
    generatedCanvas.height = ch;
    let generatedCanvasContext: CanvasRenderingContext2D = generatedCanvas.getContext("2d");

    let generatedDrawingManager = new DrawingManager(generatedCanvasContext, imageCanvas.width, imageCanvas.height);
    generatedDrawingManager.clear();

    
    let numTriangles = urlParams.num_triangles ? (+urlParams.num_triangles) : 9;
    let numWorkers = urlParams.num_workers ? (+urlParams.num_workers) : 4;
    let popSize = urlParams.pop_size ? (+urlParams.pop_size) : 200;
    let sampleSize = urlParams.sample_size ? (+urlParams.sample_size) : 500;
    let mutationRate = urlParams.mutation_rate ? (+urlParams.mutation_rate) : 0.25;
    maxGeneration = urlParams.num_generations ? (+urlParams.num_generations) : 200;

    let wm = new WorkerManager(numWorkers);
    let pm = new PopulationManager(generatedDrawingManager, imageDrawingManager, wm);
    pm.init(popSize, sampleSize, numTriangles, mutationRate);

    let graphElement = <HTMLCanvasElement>document.getElementById('fitnessgraph')
    let graphContext = graphElement.getContext('2d');
    graphManager = new GraphingManager(graphContext, graphElement.width, graphElement.height);


    setTimeout(() => {cycleCallback(pm)}, 200);
    setFormInputs(urlParams.file, numWorkers, numTriangles, popSize, sampleSize, mutationRate, maxGeneration);
    // pm.createNextGeneration();

}

let setFormInputs = (
        filename: string, 
        numWorkers: number, 
        numTriangles: number, 
        popSize: number, 
        sampleSize: number, 
        mutationRate: number, 
        numGenerations: number
) => {
    let fileInput = <HTMLInputElement> document.getElementById("filename_input");
    let numWorkersInput = <HTMLInputElement> document.getElementById("num_workers");
    let numTrianglesInput = <HTMLInputElement> document.getElementById("num_triangles");
    let popSizeInput = <HTMLInputElement> document.getElementById("pop_size");
    let sampleSizeInput = <HTMLInputElement> document.getElementById("sample_size");
    let mutationRateInput = <HTMLInputElement> document.getElementById("mutation_rate");
    let numGenerationsInput = <HTMLInputElement> document.getElementById("num_generations");

    fileInput.value = filename;
    numWorkersInput.value = numWorkers + "";
    numTrianglesInput.value = numTriangles + "";
    popSizeInput.value = popSize + "";
    sampleSizeInput.value = sampleSize + "";
    mutationRateInput.value = mutationRate + "";
    numTrianglesInput.value = numGenerations + "";
}

let cycleCallback = (pm: PopulationManager, frame: number = 0) => {
    console.log("Working on generation ", pm.generation);
    if(pm.generation < maxGeneration) {
        pm.createNextGeneration().then(
            () => {
                let line = pm.population.map(
                    (gen: TriangleSpecimenModel[], indx: number): [number, number] => {

                        return [indx, gen[0].fitness + 1000000];
                    }
                );
                graphManager.drawLineGraph(line);

                setTimeout(() => {cycleCallback(pm)}, 200);
            }
        );
    } else {
        // pm.getFitness(pm.population[frame][0].triangles);
        // setTimeout(() => {cycleCallback(pm, (frame + 1) % 200)}, 200);
    }
}

