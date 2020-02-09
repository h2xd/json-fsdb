import { DatabaseBinding } from '../types';

export function getAllFromCollection<Schema>(methods: DatabaseBinding<Schema>) {
  const { memory, key } = methods;

  return function getAll() {
    return memory[key];
  }
}