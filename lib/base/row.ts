// FILE: lib/base/row.ts

export class RawRow {
  public id: number;
  public value: string|Object;
}


export class Row {
  private id_: number;
  private payload_: Object;

  constructor(id: number, payload?: Object) {
    this.id_ = id;
    this.payload_ = payload || this.defaultPayload();
  }

  private static nextId_: number = 0;
  private static DUMMY_ID: number = -1;

  public static getNextId(): number {
    return Row.nextId_++;
  }

  public static setNextId(nextId: number): void {
    Row.nextId_ = nextId;
  }

  public id(): number {
    return this.id_;
  }

  public assignRowId(id: number): void {
    this.id_ = id;
  }

  public payload(): Object {
    return this.payload_;
  }

  public defaultPayload(): Object {
    return {};
  }

  public toDbPayload(): Object {
    return this.payload_;
  }

  public serialize(): RawRow {
    return {
      'id': this.id_,
      'value': this.toDbPayload()
    };
  }

  // TODO(arthurhsu): define key type nicely
  public keyOfIndex(indexName: string): number|string {
    if (indexName.substr(-1) == '#') {
      return this.id_;
    }

    // Remaining indices keys are implemented by overriding keyOfIndex in
    // subclasses.
    return null;
  }

  public static deserialize(data: RawRow): Row {
    return new Row(data['id'], data['value']);
  }

  public static create(opt_payload?: Object): Row {
    return new Row(Row.getNextId(), opt_payload || {});
  }

  public static binToHex(buffer: ArrayBuffer): string {
    if (!buffer) {
      return null;
    }

    var uint8Array = new Uint8Array(buffer);
    var s = '';
    for (var i = 0; i < uint8Array.length; ++i) {
      var chr = uint8Array[i].toString(16);
      s += chr.length < 2 ? '0' + chr : chr;
    }
    return s;
  }

  public static hexToBin(hex: string): ArrayBuffer {
    if (!hex || hex.length < 2) {
      return null;
    }

    if (hex.length % 2 != 0) {
      hex = '0' + hex;
    }
    var buffer = new ArrayBuffer(hex.length / 2);
    var uint8Array = new Uint8Array(buffer);
    for (var i = 0, j = 0; i < hex.length; i += 2) {
      uint8Array[j++] = parseInt(hex.substr(i, 2), 16);
    }
    return buffer;
  }
}
