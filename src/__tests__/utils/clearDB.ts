import rimraf from 'rimraf';

export async function clearDB(dir: string) {
  return new Promise((resolve, reject) => {
    rimraf(dir, (err) => {
      if (err) {
        reject(err)
      }

      resolve();
    });
  });
};