enum SpecimenType {
    TRIANGLE_SPECIMEN,
    CONSTRAINED_TRIANGLE_SPECIMEN, // TODO
    RECT_SPECIMEN, // TODO
    SQUARE_SPECIMEN, // TODO
}

class SpecimenHelper {
    static createFromJsonObj(spo: ISpecimenModel): ISpecimenModel {
        let out: ISpecimenModel;
        switch(spo.type) {
            case SpecimenType.TRIANGLE_SPECIMEN:
                //TODO: create an actual object from the data
                let ts: TriangleModel[] = (<any>spo).triangles.map( (t: any) => {return TriangleModel.fromJsonObj(t);})//TriangleModel.fromJsonObj((<any>spo).triangles)
                out = new TriangleSpecimenModel(ts);
                if(spo.clearColor) {
                    out.clearColor = new ColorModel(spo.clearColor.red, spo.clearColor.green, spo.clearColor.blue, spo.clearColor.alpha);
                }
                break;
            default:
                console.log("AN UNEXPECTED TYPE OF SPECIMEN");

        }

        return out;
    }
}