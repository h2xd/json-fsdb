const TEST_DIR = "<rootDir>/__tests__";

module.exports = {
  "roots": [
    "<rootDir>/__tests__"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "modulePathIgnorePatterns": [
    `${TEST_DIR}/utils`,
    `${TEST_DIR}/setup`
  ],
}