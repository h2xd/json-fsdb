import { clearDB } from './utils/clearDB';
import { generateDB } from './utils/generateDB';

const DIR = '.testdir';
const NAME = 'testdb';

interface User {
  name: string;
  age: number;
}

interface Schema {
  users: User[];
}

beforeAll(async () => {
  clearDB(DIR);
});

afterAll(async () => {
  clearDB(DIR);
});

test('create database and add a user', async (cb) => {
  const DB = await generateDB<Schema>(DIR, NAME);

  const usersCollection = DB.getCollection('users');
  const user1 = { age: 26, name: 'andi' };
  const user2 = { age: 23, name: 'peter' };

  usersCollection.add(user1);
  usersCollection.add(user2);

  expect(DB.getCollection('users').getAll()).toEqual([user1, user2]);

  cb();
});