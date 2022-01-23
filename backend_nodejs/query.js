const sql_login = `SELECT * FROM member WHERE code = ?`;
const sql_join = `INSERT INTO member (code, view_code) VALUES(?, "")`;
const sql_get_containers = `SELECT * FROM container WHERE mid = ? limit ?, ?`;
const sql_get_containers_count = `SELECT count(*) as count FROM container WHERE mid = ?`;
const sql_insert_containers = `INSERT INTO container(mid, name,thumb, imgs, tags) VALUES (?, '', ?, ?, '')`;

module.exports = { sql_login, sql_join, sql_get_containers, sql_insert_containers, sql_get_containers_count };