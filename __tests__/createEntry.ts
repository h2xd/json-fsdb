import { generateDB } from './utils/generateDB';
import { TESTDIR } from './utils/options';

const FILENAME = 'testEntry';
const COLLECTION_USERS_NAME = 'users';
const COLLECTION_PRODUCTS_NAME = 'products';

interface User {
  name: string;
  age: number;
}

interface Owner {
  name: string,
}

interface Product {
  name: string;
  price: number;
  owner: Owner;
}

interface Schema {
  users: User[];
  products: Product[];
}


// test dataset
const user1 = { age: 26, name: 'andi' };
const user2 = { age: 23, name: 'peter' };
const user3 = { age: 18, name: 'cratos' };

const product1 = { name: 'Nimbus 2000', price: 2000, owner: { name: 'Harry Potter' } }
const product2 = { name: 'Nimbus 2001', price: 2001, owner: { name: 'Draco Malfoy' } }

test('create database and add a user', async (cb) => {
  const DB = await generateDB<Schema>(TESTDIR, FILENAME);

  const usersCollection = DB.getCollection(COLLECTION_USERS_NAME);
  const productsCollection = DB.getCollection(COLLECTION_PRODUCTS_NAME);

  usersCollection.add(user1);
  usersCollection.add(user2);
  usersCollection.add(user3);

  productsCollection.add(product1);
  await productsCollection.add(product2);

  expect(DB.getCollection(COLLECTION_USERS_NAME).getAll()).toEqual([user1, user2, user3]);
  expect(DB.getCollection(COLLECTION_PRODUCTS_NAME).getAll()).toEqual([product1, product2]);

  cb();
});

test('hibernation of the memory exists on the filesystem', async (cb) => {
  const DB = await generateDB<Schema>(TESTDIR, FILENAME);

  expect(DB.getCollection(COLLECTION_USERS_NAME).getAll()).toEqual([user1, user2, user3]);
  expect(DB.getCollection(COLLECTION_PRODUCTS_NAME).getAll()).toEqual([product1, product2]);
  cb();
})

