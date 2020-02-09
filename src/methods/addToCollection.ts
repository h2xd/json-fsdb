import { ArrayType, DatabaseBinding } from '../types';

export function addToCollection<Schema, K extends keyof Schema>(methods: DatabaseBinding<Schema>) {
  const { memory, key, sync } = methods;

  /**
   * add entry to the collection
   * @param data data to be stored
   */
  return function add(data: ArrayType<Schema[K]>) {
    memory[key].push(data);
    sync();
  }
}