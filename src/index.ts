import { createReadStream, createWriteStream, mkdir } from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

const mkdirAsync = promisify(mkdir);

export class Database<Schema extends { [key: string]: any[] }> {
  private memory: Schema;
  private initializied = false;

  constructor(
    private path: string,
    private initialData: Schema,
    private encoding: string = 'utf8'
  ) {

  }

  public async init(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.initializied) {
          resolve();
        }

        const readable = createReadStream(this.path, { encoding: this.encoding });

        readable.on('data', (data) => {
          this.memory = JSON.parse(data);

          this.initializied = true;
          resolve();
        });

        readable.on('error', async () => {
          this.memory = this.initialData;
          await mkdirAsync(dirname(this.path), { recursive: true });
          this.sync();

          this.initializied = true;
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  public sync() {
    console.log(this.memory);
    const writeable = createWriteStream(this.path, { encoding: this.encoding, flags: 'w' });
    writeable.write(JSON.stringify(this.memory));
  }

  private createAdder<K extends keyof Schema>(key: K) {
    return (data: Schema[K]) => {
      this.memory[key].push(data);
    }
  }

  public getCollection(key: keyof Schema) {
    return {
      data: this.memory[key],
      add: this.createAdder(key)
    }
  }
}