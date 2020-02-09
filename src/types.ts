import { JsonFSDB } from './JsonFSDB';

export interface DatabaseSignature {
  [key: string]: any[]
}

export interface DatabaseOptions {
  dir: string;
  name: string;
  encoding: string;
}

export interface DatabaseBinding<T> {
  sync: JsonFSDB<T>['sync'],
  memory: DatabaseSignature & T,
  key: keyof T
}

// unwrap up to one level
export type ArrayType<T> = T extends Array<infer U> ? U : T;