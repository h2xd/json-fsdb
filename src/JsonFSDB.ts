import { createReadStream, mkdir, writeFile } from 'fs';
import { promisify } from 'util';
import { addToCollection } from './methods/addToCollection';
import { getAllFromCollection } from './methods/getAllFromCollection';
import { removeFromCollection } from './methods/removeFromCollection';
import { DatabaseBinding, DatabaseOptions, DatabaseSignature } from './types';
import { createFilepath } from './utils/createFilepath';

const mkdirAsync = promisify(mkdir);
const writeFileAync = promisify(writeFile);

export class JsonFSDB<Schema> {
  private memory: DatabaseSignature<Schema>;
  private initializied = false;
  private filepath: string;

  constructor(
    private options: DatabaseOptions
  ) {
    const { dir, name } = this.options;

    this.filepath = createFilepath(dir, name);
  }

  public async init(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const { dir, encoding } = this.options;

      try {
        if (this.initializied) {
          resolve();
        }

        const readable = createReadStream(this.filepath, { encoding });

        readable.on('data', (data) => {
          this.memory = JSON.parse(data);

          this.initializied = true;
          resolve();
        });

        readable.on('error', async () => {
          await mkdirAsync(dir, { recursive: true });

          this.initializied = true;
          resolve();
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  /**
   * Hibernate the memory to the systems drive
   */
  public async hibernate() {
    try {
      // TODO: Find a better way to clear up the file, before the memory gets hibernated
      await writeFileAync(this.filepath, '');
      await writeFileAync(this.filepath, JSON.stringify(this.memory));
    } catch (error) {
      console.error(error);
    }
  }

  private aspectCollection<K extends keyof Schema>(key: K) {
    if (this.memory === undefined) {
      this.memory = {};
    }

    if (this.memory[key] === undefined) {
      this.memory[key] = [];
    }
  }

  /**
   * Create collection type with util functions
   * @param key key that has been defined in the schema
   */
  public getCollection<K extends keyof Schema>(key: K) {
    this.aspectCollection(key);

    const { memory, hibernate } = this;
    const methodParameterBinding = {
      hibernate: hibernate.bind(this),
      memory,
      key
    } as DatabaseBinding<Schema, K>;

    return {
      /**
       * get all entries in the collection
       */
      getAll: getAllFromCollection(methodParameterBinding),
      /**
       * add an new entry to the collection
       */
      add: addToCollection(methodParameterBinding),

      remove: removeFromCollection(methodParameterBinding),
    }
  }
}