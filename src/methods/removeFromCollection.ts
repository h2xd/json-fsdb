import { ArrayType, DatabaseBinding } from '../types';

export function removeFromCollection<Schema, K extends keyof Schema>(methods: DatabaseBinding<Schema>) {
  const { memory, key, hibernate } = methods;

  return async function remove(data: ArrayType<Schema[K]>) {
    // @ts-ignore
    memory[key] = memory[key].filter((d): d is keyof Schema => d !== data);

    await hibernate();
  }
}