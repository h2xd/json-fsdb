import { createReadStream, createWriteStream, mkdir } from 'fs';
import { promisify } from 'util';
import { DatabaseSignature, DatabaseOptions } from './types';
import { createFilepath } from './utils/createFilepath';

const mkdirAsync = promisify(mkdir);

// unwrap up to one level
type ArrayType<T> = T extends Array<infer U> ? U : T;

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

  private createAdder<K extends keyof Schema>(key: K) {
    return (data: ArrayType<Schema[K]>) => {
      this.aspectCollection(key);

      this.memory[key].push(data);
      this.sync();
    }
  }

  private createGetAll<K extends keyof Schema>(key: K) {
    return () => {
      this.aspectCollection(key);

      return this.memory[key];
    }
  }

  public getCollection<K extends keyof Schema>(key: K) {
    return {
      getAll: this.createGetAll(key),
      add: this.createAdder(key)
    }
  }
}