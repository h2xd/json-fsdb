import { DatabaseBinding } from '../types';

export function getAllFromCollection<Schema, K extends keyof Schema>(methods: DatabaseBinding<Schema, K>) {
  const { memory, key } = methods;

  /**
   * Get all entries from the selected collection
   */
  return function getAll() {
    return memory[key];
  }
}