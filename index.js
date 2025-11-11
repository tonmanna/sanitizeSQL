"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeSQL = exports.MAX_SQL_LENGTH = exports.not_allow_text = void 0;
exports.not_allow_text = [
    // Comments (block all comment styles)
    /--/,                           // SQL line comments
    /\/\*[\s\S]*?\*\//,            // Multi-line comments /* */
    /\/\*/,                         // Unclosed multi-line comment start
    /\*\//,                         // Comment end
    /#/,                            // MySQL comment style

    // Statement separators
    /;/,                            // Multiple statements

    // Dangerous PostgreSQL functions
    /current_user/i,
    /session_user/i,
    /pg_user/i,
    /getpgusername/i,
    /usesuper/i,
    /usecreatedb/i,
    /usecatupd/i,
    /current_database/i,
    /pg_database/i,
    /information_schema/i,
    /table_name/i,
    /query_to_xml/i,
    /database_to_xml/i,
    /database_to_xmlschema/i,
    /pg_ls_dir/i,
    /pg_read_file/i,
    /pg_sleep/i,
    /pg_stat_file/i,
    /pg_read_binary_file/i,
    /lo_import/i,
    /lo_export/i,

    // Common SQL injection patterns
    /exec[\s]*\(/i,                 // Command execution
    /execute[\s]*\(/i,
    /declare[\s]/i,                 // Variable declaration

    // Obfuscation attempts
    /0x[0-9a-f]+/i,                 // Hex encoding
    /[\s]+into[\s]+outfile/i,       // File operations
    /[\s]+into[\s]+dumpfile/i,
    /load_file/i,
    /load[\s]+data[\s]+infile/i,

    // System variables and functions
    /@@/,
    /\$\$/,                         // PostgreSQL dollar quoting
    /@[\w]+/,                       // Variables

    // DDL statements - prevent schema modifications
    /drop[\s]+table/i,
    /drop[\s]+database/i,
    /drop[\s]+schema/i,
    /drop[\s]+index/i,
    /drop[\s]+view/i,
    /create[\s]+table/i,
    /create[\s]+database/i,
    /create[\s]+schema/i,
    /create[\s]+index/i,
    /create[\s]+view/i,
    /alter[\s]+table/i,
    /truncate[\s]+table/i,

    // Time-based blind injection
    /sleep[\s]*\(/i,
    /benchmark[\s]*\(/i,
    /waitfor[\s]+delay/i,
];
exports.MAX_SQL_LENGTH = 100000; //2147483648 Default 2GB

/**
 * Sanitizes SQL strings to prevent injection attacks
 * @param {string} SQL - The SQL query to sanitize
 * @returns {string} - Sanitized SQL or empty string if dangerous patterns detected
 */
exports.sanitizeSQL = function (SQL) {
    if (!SQL || typeof SQL !== 'string') {
        return '';
    }

    if (SQL.length > exports.MAX_SQL_LENGTH) {
        return '';
    }

    // Normalize the SQL for pattern matching
    var normalizedSQL = SQL;

    // Step 1: Decode common encoding tricks
    try {
        // Decode URI components (like %53%45%4C%45%43%54)
        var decoded = decodeURIComponent(normalizedSQL);
        if (decoded !== normalizedSQL) {
            normalizedSQL = decoded;
        }
    } catch (e) {
        // Invalid URI encoding might itself be an attack
    }

    // Step 2: Remove zero-width characters and other Unicode tricks
    normalizedSQL = normalizedSQL
        .replace(/[\u200B-\u200D\uFEFF]/g, '')  // Zero-width spaces
        .replace(/[\u00A0]/g, ' ');              // Non-breaking spaces to regular spaces

    // Step 3: Extract and validate string literals
    var stringLiterals = [];
    var stringPattern = /'([^']|'')*'/g;
    var sqlWithoutStrings = normalizedSQL.replace(stringPattern, function(match) {
        // Check if string literal contains dangerous patterns
        var innerContent = match.slice(1, -1).replace(/''/g, "'");

        // Check for quote escape attempts in strings
        if (innerContent.match(/[\\]['";]/)) {
            stringLiterals.push('DANGEROUS');
            return 'DANGEROUS_STRING';
        }

        stringLiterals.push(match);
        return '__STRING_PLACEHOLDER__';
    });

    // If dangerous patterns found in strings, reject
    if (stringLiterals.includes('DANGEROUS')) {
        return '';
    }

    // Additional check: Look for unescaped quotes that might break out of string context
    // Pattern: '...' OR '...' which indicates string breakout attempt
    if (normalizedSQL.match(/'[^']*'\s*(OR|AND)\s*'/i)) {
        return '';
    }

    // Step 4: Check for dangerous patterns in the non-string parts
    var testSQL = sqlWithoutStrings;

    // Normalize whitespace for pattern matching (but preserve structure)
    testSQL = testSQL.replace(/\s+/g, ' ').trim();

    // Check each dangerous pattern
    for (var i = 0; i < exports.not_allow_text.length; i++) {
        var pattern = exports.not_allow_text[i];
        var reg = new RegExp(pattern, 'gi');

        if (reg.test(testSQL)) {
            // Dangerous pattern detected
            return '';
        }
    }

    // Step 5: Additional validation checks

    // Check for unbalanced quotes (potential injection)
    var singleQuotes = (normalizedSQL.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
        return '';  // Unbalanced quotes
    }

    // Check for quote-based injection patterns like: id = 1' OR '1'='1
    // This matches: digit/word followed by ' OR/AND ' pattern
    if (normalizedSQL.match(/[\w\d]\s*'\s*(OR|AND)\s*'/i)) {
        return '';  // Potential quote breakout injection
    }

    // Check for backslash escape attempts (not standard SQL)
    if (normalizedSQL.match(/\\['"]/)) {
        return '';  // Backslash escaping not allowed
    }

    // Check for multiple statement attempts
    var statementCount = (SQL.match(/;\s*\w/g) || []).length;
    if (statementCount > 0) {
        return '';  // Multiple statements detected
    }

    // Check for comment injection attempts
    if (SQL.match(/['"].*?--/)) {
        return '';  // Comment inside or after string
    }

    // Step 6: Return original SQL if all checks pass
    // Only trim excessive whitespace, don't remove functional spaces
    SQL = SQL.trim().replace(/\s+/g, ' ');

    return SQL;
};
