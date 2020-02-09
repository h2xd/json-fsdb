import { generateDB } from './utils/generateDB';
import { TESTDIR } from './utils/options';

interface User {
  name: string;
  age: number;
}

interface Schema {
  users: User[];
}

test('create database and add and remove user', async (cb) => {
  const DB = await generateDB<Schema>(TESTDIR, 'testCreateAddAndRemove');

  const usersCollection = DB.getCollection('users');
  const user1 = { age: 52, name: 'dante' };
  const user2 = { age: 18, name: 'cratos' };

  await usersCollection.add(user1);
  await usersCollection.add(user2);
  await usersCollection.remove(user1);

  expect(DB.getCollection('users').getAll()).toEqual([user2]);

  cb();
});