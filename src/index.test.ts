import { Database } from '.';
import rimraf = require('rimraf');

const testDir = '__testdata__/';

interface User {
  name: string;
  age: number;
}

interface TestSchema {
  [key: string]: any[];
  users: User[];
}

const generateDB = async <Schema extends { [key: string]: any[]; }>(initData: Schema): Promise<Database<Schema>> => new Promise(async (resolve, reject) => {
  try {
    const DB = new Database<Schema>(`${testDir}${(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))}.json`, initData);
    await DB.init();
    resolve(DB);
  } catch (e) {
    reject(e);
  }
});

const clearDB = async () => new Promise((resolve, reject) => {
  rimraf(testDir, (err) => {
    if (err) {
      reject(err)
    }

    resolve();
  });
});

beforeAll(async () => {
  clearDB();
});

afterAll(async () => {
  clearDB();
});

test('create new user an sync with database', async (cb) => {
  const DB = await generateDB<TestSchema>({ users: [] });

  const usersCollection = DB.getCollection('users');
  const data = { age: 16, name: 'andi' };

  usersCollection.add({age: 16, name: 'andi'});
  DB.sync();

  expect(DB.getCollection('users')).toEqual([data]);
  cb();
});