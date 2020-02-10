import { ArrayType, DatabaseBinding, DatabaseSignature } from '../types';

export function removeFromCollection<Schema extends DatabaseSignature<Schema>, K extends keyof Schema>(methods: DatabaseBinding<Schema, K>) {
  const { memory, key, hibernate } = methods;

  /**
   * Remove an entry from the collection
   * @param data entry to be removed
   */
  return async function remove(data: ArrayType<Schema[K]>) {
    memory[key] = (memory[key].filter((d) => d !== data) as Schema[K]);

    await hibernate();
  }
}