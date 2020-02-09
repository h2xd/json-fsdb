import { createReadStream, createWriteStream, mkdir } from 'fs';
import { promisify } from 'util';
import { addToCollection } from './methods/addToCollection';
import { getAllFromCollection } from './methods/getAllFromCollection';
import { DatabaseOptions, DatabaseSignature } from './types';
import { createFilepath } from './utils/createFilepath';

const mkdirAsync = promisify(mkdir);

export class JsonFSDB<Schema> {
  private memory: DatabaseSignature & Schema;
  private initializied = false;

  constructor(
    private options: DatabaseOptions
  ) {

  }

  public async init(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const { dir, name, encoding } = this.options;

      try {
        if (this.initializied) {
          resolve();
        }

        const readable = createReadStream(createFilepath(dir, name), { encoding });

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

  public sync() {
    try {
      const { dir, name, encoding } = this.options;

      const writeable = createWriteStream(createFilepath(dir, name), { encoding, flags: 'w' });

      writeable.write(JSON.stringify(this.memory));
      writeable.end();
    } catch (error) {
      console.error(error);
    }
  }

  private aspectCollection<K extends keyof Schema>(key: K) {
    if (this.memory === undefined) {
      // TODO research how a assign empty types to the defined "Schema" type
      // @ts-ignore
      this.memory = {};
    }

    if (this.memory[key] === undefined) {
      // @ts-ignore
      this.memory[key] = [];
    }
  }

  /**
   * Create collection type with util functions
   * @param key key that has been defined in the schema
   */
  public getCollection<K extends keyof Schema>(key: K) {
    this.aspectCollection(key);

    const { memory, sync } = this;
    const methodParameterBinding = {
      sync: sync.bind(this),
      memory,
      key
    }

    return {
      /**
       * get all entries in the collection
       */
      getAll: getAllFromCollection(methodParameterBinding),
      /**
       * add an new entry to the collection
       */
      add: addToCollection(methodParameterBinding)
    }
  }
}