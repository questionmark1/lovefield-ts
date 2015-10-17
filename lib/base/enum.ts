export enum ConstraintAction {
  RESTRICT,
  CASCADE
}

export enum ConstraintTiming {
  IMMEDIATE,
  DEFERRABLE
}

export enum Order {
  DESC,
  ASC
}

export enum Type {
  ARRAY_BUFFER,
  BOOLEAN,
  DATE_TIME,
  INTEGER,
  NUMBER,
  STRING,
  OBJECT
}

export namespace type {
  var DEFAULT_ARRAY_BUFFER: ArrayBuffer = null;
  var DEFAULT_OBJECT: Object = null;

  export var DEFAULT_VALUES = {
    0: DEFAULT_ARRAY_BUFFER,  // lf.Type.ARRAY_BUFFER
    1: false,  // lf.Type.BOOLEAN
    2: Object.freeze(new Date(0)),  // lf.Type.DATE_TIME
    3: 0,  // lf.Type.INTEGER
    4: 0,  // lf.Type.NUMBER
    5: '',  // lf.Type.STRING
    6: DEFAULT_OBJECT // lf.Type.OBJECT
  }
}
