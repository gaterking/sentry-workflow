module.exports = {
    "moduleFileExtensions": [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx"
    ],
    "transform": {
        // ".+\\.tsx?$": "<rootDir>/node_modules/ts-jest"
    },
    "testMatch": [
        "**/__tests__/**/*.(js|ts)?(x)",
        "**/?(*.)(spec|test).(js|ts)?(x)"
    ],
    "globals": {
        // 'ts-jest': {
        //   "tsConfig": 'tsconfig.json'
        // }
    },
    "modulePaths": [
        "<rootDir>/src/"
    ],
    "moduleNameMapper": {
        // "^(.*)$": "<rootDir>/src/$1",
    }
};
