import { JsonFSDB } from './JsonFSDB';

export interface DatabaseSignature {
  [key: string]: any[]
}

export interface DatabaseOptions {
  dir: string;
  name: string;
  encoding: string;
}

export interface DatabaseMethodsOptions<T, K extends keyof T> {
  sync: JsonFSDB<T>['sync'],
  key: K
}