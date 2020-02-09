import { JsonFSDB } from '../../JsonFSDB';

export async function generateDB<T>(dir: string, name: string): Promise<JsonFSDB<T>> {
  return new Promise(async (resolve, reject) => {
    try {
      const DB = new JsonFSDB<T>({
        dir,
        name,
        encoding: 'utf8'
      });
      await DB.init();
      resolve(DB);
    } catch (e) {
      reject(e);
    }
  });
};