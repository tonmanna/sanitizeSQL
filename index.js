"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeSQL = exports.MAX_SQL_LENGTH = exports.not_allow_text = void 0;
exports.not_allow_text = [
    /--/,
    /;/,
    /\\*\\*/,
    /current_user/,
    /session_user/,
    /pg_user/,
    /getpgusername/,
    /usesuper/,
    /usecreatedb/,
    /usecatupd/,
    /current_database/,
    /pg_database/,
    /selectselect/,
    /information_schema/,
    /table_name/,
    /query_to_xml/,
    /database_to_xml/,
    /database_to_xmlschema/,
    /postgresql/,
    /randnum/,
    /sleeptime/,
    /pg_ls_dir/,
    /pg_read_file/,
    /pg_sleep/,
    /@@/,
    /\$\$/,
    '',
];
exports.MAX_SQL_LENGTH = 100000; //2147483648 Default 2GB
exports.sanitizeSQL = function (SQL) {
    if (SQL.length > exports.MAX_SQL_LENGTH) {
        return '';
    }
    function removeMultipleSpace(str) {
        return str.replace(/ +(?= )/g, '');
    }
    exports.not_allow_text.forEach(function (value) {
        var reg = new RegExp(value, 'gi');
        var maxAttempt = 255;
        var prevSQL = removeMultipleSpace(SQL).replace(reg, '').replace(/\s+/g, '');
        for (var i = 0; i < maxAttempt; i++) {
            SQL = removeMultipleSpace(SQL).replace(reg, '').replace(/\s+/g, ' ');
            if (prevSQL === SQL) {
                break;
            }
            prevSQL = SQL;
        }
    });
    if (SQL == ' ')
        SQL = '';
    if (SQL.length > 0)
        if (SQL[SQL.length - 1] == ' ')
            SQL = SQL.slice(0, -1);
    if (SQL.length > 0)
        if (SQL[0] == ' ')
            SQL = SQL.slice(1, SQL.length);
    return SQL;
};
