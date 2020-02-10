import { JsonFSDB } from './JsonFSDB';

export type DatabaseSignature<Schema> = {
  [Key in keyof Schema]?: ArrayType<Schema[keyof Schema]>[]
}

export interface DatabaseOptions {
  dir: string;
  name: string;
  encoding: string;
}

export interface DatabaseBinding<Schema, K extends keyof Schema> {
  hibernate: JsonFSDB<Schema>['hibernate'],
  memory: DatabaseSignature<Schema>,
  key: K
}

// unwrap to get the array type
export type ArrayType<T> = T extends Array<infer U> ? U : T;