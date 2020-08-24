import { sanitizeSQL } from './index';
// Thanks for this repo : for submit cheet sheet
// https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/PostgreSQL%20Injection.md#postgresql-comments
describe('Test sanitize function for each injection case from this link', () => {
    it('', () => {
        const result = sanitizeSQL('SELECT * from UserName --/**/');
        expect(result).toEqual('SELECT * from UserName ');
    });
});
