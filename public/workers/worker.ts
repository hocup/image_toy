/// <reference path="../src/ColorModel.ts"/>
/// <reference path="../src/MathHelper.ts"/>
/// <reference path="../src/TriangleModel.ts"/>

onmessage = function(e) {
    // console.log('Message received from main script', e);
    let workerResult = null;
    let triangles: TriangleModel[] = e.data.map((raw: any) => TriangleModel.fromJsonObj(raw));;
    
    workerResult = triangles.filter( 
        (t: TriangleModel) => {
            return t.containsPoint([0.5,0.5]);
        }
    );

    postMessage(workerResult);
}
