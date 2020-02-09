import rimraf from 'rimraf';
import { TESTDIR } from '../utils/options';

export function cleanUp() {
  return new Promise((resolve, reject) => {
    rimraf(TESTDIR, (err) => {
      if (err) {
        reject(err)
      }

      resolve();
    });
  });
};