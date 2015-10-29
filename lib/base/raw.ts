// FILE: lib/base/raw.ts

import {Row} from 'row';


namespace raw {


export interface BackStore {
  getRawDBInstance(): any;

  getRawTransaction(): any;

  dropTable(tableName: string): Promise<void>;

  addTableColumn(
      tableName: string,
      columnName: string,
      defaultValue: string|boolean|number|Date|ArrayBuffer): Promise<void>;

  dropTableColumn(tableName: string, columnName:string): Promise<void>;

  renameTableColumn(
      tableName: string,
      oldColumnName: string,
      newColumnName:string) : Promise<void>;

  createRow(payload: Object): Row;

  getVersion(): number;

  dump(): Array<Object>;
}


}  // namespace raw
