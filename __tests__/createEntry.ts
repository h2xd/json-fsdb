import { generateDB } from './utils/generateDB';
import { TESTDIR } from './utils/options';

const FILENAME = 'testEntry';
const COLLECTION_NAME = 'users';

interface User {
  name: string;
  age: number;
}

interface Schema {
  users: User[];
}


// test dataset
const user1 = { age: 26, name: 'andi' };
const user2 = { age: 23, name: 'peter' };
const user3 = { age: 18, name: 'cratos' };

test('create database and add a user', async (cb) => {
  const DB = await generateDB<Schema>(TESTDIR, FILENAME);

  const usersCollection = DB.getCollection(COLLECTION_NAME);

  await usersCollection.add(user1);
  await usersCollection.add(user2);
  await usersCollection.add(user3);

  expect(DB.getCollection(COLLECTION_NAME).getAll()).toEqual([user1, user2, user3]);

  cb();
});

test('hibernation of the memory exists on the filesystem', async (cb) => {
  const DB = await generateDB<Schema>(TESTDIR, FILENAME);

  expect(DB.getCollection(COLLECTION_NAME).getAll()).toEqual([user1, user2, user3]);
  cb();
})

