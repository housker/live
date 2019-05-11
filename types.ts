export class Current {
    labels: Label[];
    values1: Point[];
    values2: Point[];
    values3: Point[];
}

export class Update {
    labels: Label;
    values1: number;
    values2:  number;
    values3: number;
}

export class Label {
    _id: string; 
    date: string; 
    label: string;
}

export class Point {
    _id: string; 
    type: number; 
    value: number; 
    date: string;
    // ts_id: string;
}

