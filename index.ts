const not_allow_text = ['--', '/\\*\\*/'];

export const sanitizeSQL = (SQL: string): string => {
    not_allow_text.forEach((value) => {
        const reg = new RegExp(value, 'g');
        SQL = SQL.replace(reg, '');
    });
    return SQL;
};
