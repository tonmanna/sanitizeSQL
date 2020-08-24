module.exports = {
    env: {
        browser: false,
        es6: true,
        node: true,
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2019,
    },
    extends: ['eslint:recommended'],
    rules: {
        'new-cap': 'off',
        'no-console': 'off',
        camelcase: 'off',
        'no-return-await': 'off',
        'no-unused-vars': ['off'],
        eqeqeq: 'off',
    },
    globals: {
        jest: true,
        describe: true,
        test: true,
        expect: true,
    },
};
