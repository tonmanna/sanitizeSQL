import { sanitizeSQL, MAX_SQL_LENGTH, not_allow_text } from './index';

describe('sanitizeSQL', () => {
    it('should remove disallowed text from SQL', () => {
        const SQL = 'SELECT * FROM users; -- This is a comment';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT  FROM users');
    });

    it('should handle empty SQL', () => {
        const SQL = '';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).toEqual('');
    });

    it('should handle SQL with no disallowed text', () => {
        const SQL = 'SELECT * FROM users';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).toEqual('SELECT * FROM users');
    });

    it('should handle SQL exceeding maximum length', () => {
        const SQL = 'SELECT * FROM users'.repeat(10000); // 100,000 characters
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL.length).toBeLessThanOrEqual(MAX_SQL_LENGTH);
    });
    it('should remove disallowed words from SQL', () => {
        const SQL = 'SELECT * FROM users WHERE password = "password123";';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users WHERE password = "***********";');
    });

    it('should remove multiple disallowed words from SQL', () => {
        const SQL = 'SELECT * FROM users; DROP TABLE users;';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users; DROP TABLE users;');
    });

    it('should handle SQL with disallowed words and comments', () => {
        const SQL = 'SELECT * FROM users; -- This is a comment with disallowed word DROP';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users; -- This is a comment with disallowed word ********');
    });
    it('should remove disallowed words from SQL', () => {
        const SQL = 'SELECT * FROM users WHERE password = "password123";';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toEqual('SELECT * FROM users WHERE password = "***********";');
    });

    it('should remove multiple disallowed words from SQL', () => {
        const SQL = 'SELECT * FROM users; PG_SLEEP;';
        const sanitizedSQL = sanitizeSQL(SQL);
        expect(sanitizedSQL).not.toContain('PG_SLEEP');
    });
    // TODO: From not_allow_text please generate test case for each not_allow_text must be remove after call function you can generate any kind of SQL on SQL command all many unittest for each not_allow_text
    it('should remove each disallowed word from SQL', () => {
        not_allow_text.forEach((regWord) => {
            const word = regWord.toString();
            const SQL = `SELECT * FROM users WHERE column = '${word}';  ${word.toUpperCase()}`;
            const sanitizedSQL = sanitizeSQL(SQL);
            expect(sanitizedSQL).not.toContain(word);
            expect(sanitizedSQL).not.toContain(word.toLowerCase());
            expect(sanitizedSQL).not.toContain(word.toLocaleLowerCase());
            expect(sanitizedSQL).not.toContain(word.toUpperCase());
        });
    });
});
