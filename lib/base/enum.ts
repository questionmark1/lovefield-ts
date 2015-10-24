// FILE: lib/base/enum.ts

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
  let DEFAULT_ARRAY_BUFFER: ArrayBuffer = null;
  let DEFAULT_OBJECT: Object = null;

  export let DEFAULT_VALUES: Map<Type, any> = new Map([
    [Type.ARRAY_BUFFER, DEFAULT_ARRAY_BUFFER],
    [Type.BOOLEAN, false],
    [Type.DATE_TIME, Object.freeze(new Date(0))],
    [Type.INTEGER, 0],
    [Type.NUMBER, 0],
    [Type.STRING, ''],
    [Type.OBJECT, DEFAULT_OBJECT]
  ]);
}
