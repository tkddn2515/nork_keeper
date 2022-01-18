const sql_login = `SELECT * FROM member WHERE code = ?`;
const sql_join = `INSERT INTO member (code, view_code) VALUES(?, "")`;
const sql_get_containers = `SELECT * FROM container WHERE mid = ?`;

module.exports = { sql_login, sql_join, sql_get_containers };