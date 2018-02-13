/// <reference path="../src/ColorModel.ts"/>
/// <reference path="../src/MathHelper.ts"/>
/// <reference path="../src/TriangleModel.ts"/>
/// <reference path="../src/FitnessMessageModel.ts"/>
/// <reference path="../src/SpecimenHelper.ts"/>
/// <reference path="../src/DrawingManager.ts"/>
/// <reference path="../src/SpecimenModel.ts"/>


// Some declarations to appease the compiler
declare class CanvasRenderingContext2D{
    fillStyle: string;
    fillRect: (x: number, y: number, w: number, h: number) =>  void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    beginPath: () => void;
    fill: () => void;
    drawImage: (i: any, x:  number, y: number) => void;
    getImageData: (x: number, y: number, w: number, h: number) => any;

};

declare class HTMLImageElement{};


onmessage = function(e) {
    // console.log('Message received from main script', e);
    let msg: FitnessMessageModel = e.data;

    msg.sourceColors = msg.sourceColors.map( (c) => {return new ColorModel(c.red, c.green, c.blue, c.alpha)});

    let s: ISpecimenModel = SpecimenHelper.createFromJsonObj(msg.specimen);
    let result = new FitnessMessageResponse();
    result.fitness = s.getFitnessNoCanvas(msg.samplePoints, msg.sourceColors);
    result.callbackId = msg.callbackId;

    // let workerResult = null;
    // let triangles: TriangleModel[] = e.data.map((raw: any) => TriangleModel.fromJsonObj(raw));;
    
    // workerResult = triangles.filter( 
    //     (t: TriangleModel) => {
    //         return t.containsPoint([0.5,0.5]);
    //     }
    // );

    postMessage(result);
}
