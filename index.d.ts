export declare const not_allow_text: RegExp[];
export declare const MAX_SQL_LENGTH = 100000;
/**
 * Sanitizes SQL strings to prevent injection attacks
 * @param {string} SQL - The SQL query to sanitize
 * @returns {string} - Sanitized SQL or empty string if dangerous patterns detected
 */
export declare const sanitizeSQL: (SQL: string) => string;
