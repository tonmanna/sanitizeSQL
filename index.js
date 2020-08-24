const not_allow_text = [
    "--",
    "/\\*\\*/"
]

const sanitizeSQL = (SQL) => {
    not_allow_text.forEach((value) => {
        const reg = new RegExp(value, 'g')
        SQL = SQL.replace(reg, '')
    })
    return SQL
}

module.exports = {
    sanitizeSQL
}
