module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "off"
        ],
        "no-console": [
            "off"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-unused-vars": [
            "off"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "warn",
            "never"
        ]
    }
};
