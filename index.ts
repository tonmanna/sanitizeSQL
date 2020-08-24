const not_allow_text = [
    ';',
    '--',
    '/\\*\\*/',
    'SELECT user',
    'SELECT current_user',
    'SELECT session_user',
    'SELECT usename FROM pg_user',
    'SELECT getpgusername()',
    'SELECT usename FROM pg_user',
    'SELECT usename FROM pg_user WHERE usesuper IS TRUE',
    'SELECT usename, usecreatedb, usesuper, usecatupd FROM pg_user',
    'SELECT current_database()',
    'SELECT datname FROM pg_database',
    'SELECT table_name FROM information_schema.tables',
    "SELECT column_name FROM information_schema.columns WHERE table_name='data_table'",
    "select query_to_xml('select * from pg_user',true,true,'')",
    "select database_to_xml(true,true,'')",
    "select database_to_xmlschema(true,true,'')",
    "' and substr(version(),1,10) = 'PostgreSQL' and '",
    "' and substr(version(),1,10) = 'PostgreXXX' and '",
    'AND [RANDNUM]=(SELECT [RANDNUM] FROM PG_SLEEP([SLEEPTIME]))',
    "select pg_ls_dir('./')",
    "select pg_read_file('PG_VERSION', 0, 200)",
    'CHR(65)',
    'CHR(66)',
    'CHR(67)',
    '$$',
];

export const sanitizeSQL = (SQL: string): string => {
    not_allow_text.forEach((value) => {
        const reg = new RegExp(value, 'g');
        SQL = SQL.replace(reg, '');
    });
    return SQL;
};
