"use strict";
exports.__esModule = true;
exports.sanitizeSQL = void 0;
var not_allow_text = [
    ';',
    '--',
    '/\\*\\*/',
    'select user',
    'current_user',
    'session_user',
    'pg_user',
    /getpgusername/,
    'usesuper',
    'usecreatedb',
    'usesuper',
    'usecatupd',
    /current_database\(\)/,
    'pg_database',
    'SELECTSELECT',
    'FROM information_schema.tables',
    "FROM information_schema.columns",
    "WHERE table_name='data_table",
    "select query_to_xml",
    /database_to_xml/,
    "database_to_xmlschema",
    /'PostgreSQL' and /,
    /'PostgreXXX' and /,
    /AND \[RANDNUM\]=\(SELECT \[RANDNUM\] FROM PG_SLEEP\(\[SLEEPTIME\]\)\)/,
    /FROM PG_SLEEP/,
    /pg_ls_dir/,
    /pg_read_file/,    
    'CHR(65)',
    'CHR(66)',
    'CHR(67)',
    '$$',
];
exports.sanitizeSQL = function (SQL) {
    if(SQL.length > 2147483648){
        return "";
    }   
    function removeMultipleSpace(str){
        return str.replace(/ +(?= )/g,'');
    }     
    not_allow_text.forEach(function (value) {
        var reg = new RegExp(value, 'gi');
        let maxAttempt = 255
        
        let prevSQL = removeMultipleSpace(SQL).replace(reg, '').replace(/\s+/g, ' ');
        for(let i = 0; i < maxAttempt; i++){
           SQL = removeMultipleSpace(SQL).replace(reg, ' ').replace(/\s+/g, ' ');
           if(prevSQL === SQL){
               break;
           }
           prevSQL = SQL;
        }
    });
    if(SQL==" ")SQL = ''    
    if(SQL.length>0)if(SQL[SQL.length-1] == ' ')SQL = SQL.slice(0, -1)
    if(SQL.length>0)if(SQL[0] == ' ')SQL = SQL.slice(1, SQL.length);
    return SQL;
};