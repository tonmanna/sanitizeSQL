import { sanitizeSQL } from './index';
// Thanks for this repo : for submit cheet sheet
// https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL%20Injection/PostgreSQL%20Injection.md#postgresql-comments
describe('Test sanitize function for each injection case from this link', () => {
    it('', () => {
        const result = sanitizeSQL('SELECT * from UserName --/**/;DROP TABLE USERNAME;select      user');
        //TODO: syntax validate DROP TABLE should not run because is wrong syntax
        expect(result).toEqual('SELECT * from UserName DROP TABLE USERNAME');
    });
    it('', () => {
        const result = sanitizeSQL(
            'SELECTSELECT current_database()current_database()SELECTSELECT current_database()current_database()SELECTSELECT current_database()current_database()SELECTSELECT current_database()current_database()SELECTSELECT current_database()current_database()',
        );
        //TODO: syntax validate DROP TABLE should not run because is wrong syntax
        expect(result).toEqual('');
    });
    it('', () => {
        const result = sanitizeSQL("'PostgreSQL' and ");
        //TODO: syntax validate DROP TABLE should not run because is wrong syntax
        expect(result).toEqual('');
    });
    it('', () => {
        const mock = `    SELECT
            id,
            page_id "pageID",
            seller_id "sellerID",
            name "name",
            picture,
            url,
            access_token "accessToken",
            CASE 
              WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              WHEN page_type = 'shopee' THEN to_char(updated_at + (payload::json->>'expire_in') :: NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              END AS "accessTokenExpire",
            page_type "pageType",
              payload::json->>'refresh_token' "refreshToken",
            CASE 
              WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'refresh_expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') 
              WHEN page_type = 'shopee' THEN to_char(updated_at + INTERVAL '1' DAY * 1231 , 'YYYY-MM-DD HH24:MM:SS') 
              END AS "refreshTokenExpire",
            created_at AS "createdAt",
            updated_at AS "updatedAt",
            payload
    FROM
            pages_third_party
    WHERE
            active = TRUE
            AND page_type = ANY($1)
            AND page_id = $2`;
        const result = sanitizeSQL(mock);
        //TODO: syntax validate DROP TABLE should not run because is wrong syntax
        expect(result).toEqual(
            `SELECT id, page_id "pageID", seller_id "sellerID", name "name", picture, url, access_token "accessToken", CASE WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') WHEN page_type = 'shopee' THEN to_char(updated_at + (payload::json->>'expire_in') :: NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') END AS "accessTokenExpire", page_type "pageType", payload::json->>'refresh_token' "refreshToken", CASE WHEN page_type = 'lazada' THEN to_char(updated_at + (payload::json->>'refresh_expires_in')::NUMERIC * INTERVAL '1 second', 'YYYY-MM-DD HH24:MM:SS') WHEN page_type = 'shopee' THEN to_char(updated_at + INTERVAL '1' DAY * 1231 , 'YYYY-MM-DD HH24:MM:SS') END AS "refreshTokenExpire", created_at AS "createdAt", updated_at AS "updatedAt", payload FROM pages_third_party WHERE active = TRUE AND page_type = ANY($1) AND page_id = $2`,
        );
    });
});
