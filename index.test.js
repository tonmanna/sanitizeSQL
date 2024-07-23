"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
describe('sanitizeSQL', function () {
    it('should remove disallowed text from SQL', function () {
        var SQL = 'SELECT * FROM users; -- This is a comment';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT  FROM users');
    });
    it('should handle empty SQL', function () {
        var SQL = '';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).toEqual('');
    });
    it('should handle SQL with no disallowed text', function () {
        var SQL = 'SELECT * FROM users';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).toEqual('SELECT * FROM users');
    });
    it('should handle SQL exceeding maximum length', function () {
        var SQL = 'SELECT * FROM users'.repeat(10000); // 100,000 characters
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL.length).toBeLessThanOrEqual(index_1.MAX_SQL_LENGTH);
    });
    it('should remove disallowed words from SQL', function () {
        var SQL = 'SELECT * FROM users WHERE password = "password123";';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users WHERE password = "***********";');
    });
    it('should remove multiple disallowed words from SQL', function () {
        var SQL = 'SELECT * FROM users; DROP TABLE users;';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users; DROP TABLE users;');
    });
    it('should handle SQL with disallowed words and comments', function () {
        var SQL = 'SELECT * FROM users; -- This is a comment with disallowed word DROP';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users; -- This is a comment with disallowed word ********');
    });
    it('should remove disallowed words from SQL', function () {
        var SQL = 'SELECT * FROM users WHERE password = "password123";';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users WHERE password = "***********";');
    });
    it('should remove multiple disallowed words from SQL', function () {
        var SQL = 'SELECT * FROM users; PG_SLEEP;';
        var sanitizedSQL = index_1.sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toContain('PG_SLEEP');
    });
    // TODO: From not_allow_text please generate test case for each not_allow_text must be remove after call function you can generate any kind of SQL on SQL command all many unittest for each not_allow_text
    it('should remove each disallowed word from SQL', function () {
        index_1.not_allow_text.forEach(function (regWord) {
            var word = regWord.toString();
            var SQL = "SELECT * FROM users WHERE column = '" + word + "';  " + word.toUpperCase();
            var sanitizedSQL = index_1.sanitizeSQL(SQL);
            expect(sanitizedSQL).not.toContain(word);
            expect(sanitizedSQL).not.toContain(word.toLowerCase());
            expect(sanitizedSQL).not.toContain(word.toLocaleLowerCase());
            expect(sanitizedSQL).not.toContain(word.toUpperCase());
        });
    });
});
