export const not_allow_text = [
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
    /selectselect/, //after remove white space it will be select select
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
] as string[];

export const MAX_SQL_LENGTH = 100000; //2147483648 Default 2GB
export const sanitizeSQL = function (SQL: string) {
    if (SQL.length > MAX_SQL_LENGTH) {
        return '';
    }
    function removeMultipleSpace(str: string) {
        return str.replace(/ +(?= )/g, '');
    }
    not_allow_text.forEach(function (value: string) {
        var reg = new RegExp(value, 'gi');
        let maxAttempt = 255;

        let prevSQL = removeMultipleSpace(SQL).replace(reg, '').replace(/\s+/g, '');
        for (let i = 0; i < maxAttempt; i++) {
            SQL = removeMultipleSpace(SQL).replace(reg, '').replace(/\s+/g, ' ');
            if (prevSQL === SQL) {
                break;
            }
            prevSQL = SQL;
        }
    });
    if (SQL == ' ') SQL = '';
    if (SQL.length > 0) if (SQL[SQL.length - 1] == ' ') SQL = SQL.slice(0, -1);
    if (SQL.length > 0) if (SQL[0] == ' ') SQL = SQL.slice(1, SQL.length);
    return SQL;
};
