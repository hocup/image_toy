class FitnessMessageModel {
    callbackId: string;
    samplePoints: [number, number][];
    specimen: ISpecimenModel;
    sourceColors: ColorModel[];
}

class FitnessMessageResponse {
    fitness: number;
    callbackId: string;
}