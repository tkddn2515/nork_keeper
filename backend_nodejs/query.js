const sql_login = `SELECT * FROM member WHERE code = ?`;
const sql_join = `INSERT INTO member (code, view_code) VALUES(?, "")`;
const sql_get_containers = `SELECT * FROM container WHERE mid = ? limit ?, ?`;
const sql_get_tags = `SELECT name FROM tag WHERE mid = ?`;
const sql_get_containers_count = `SELECT count(*) as count FROM container WHERE mid = ?`;
const sql_insert_containers = `INSERT INTO container(mid, name,thumb, imgs, tags) VALUES (?, '', ?, ?, '')`;
const sql_change_container_name = `UPDATE container SET name = ? WHERE id = ?`;
const sql_change_container_tag = `UPDATE container SET tags = ? WHERE id = ?`;
const sql_insert_tag = `INSERT IGNORE INTO tag (mid, name) VALUES (?, ?);`

module.exports = { sql_login, sql_join, sql_get_containers, sql_get_tags, sql_insert_containers, sql_get_containers_count, sql_change_container_name, sql_change_container_tag, sql_insert_tag };