import * as jest from 'jest';
import { cleanUp } from './cleanUp';
import { TESTDIR } from '../utils/options';

// globalSetup emulation with ts-jest
async function init() {
  console.log(`Initialization - Cleaning up "${TESTDIR}"`);

  return new Promise<void>((resolve) => {
    cleanUp();
    resolve();
  });
}

// globalTeardown emulation with ts-jest
async function afterTests() {
  console.log(`End of tests - Cleaning up "${TESTDIR}"`);
  cleanUp();
}

init()
  // @ts-ignore
  .then(jest.run)
  .then(afterTests)
  .catch((e: Error) => console.error(e));