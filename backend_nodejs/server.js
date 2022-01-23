const express = require("express");
const cors = require('cors');
const mysql      = require('mysql2');
const multer = require('multer');

const { sql_login, sql_join, sql_get_containers_count, sql_insert_containers } = require('./query');
const { dataBase } = require('./db');
const { upload } = require('./s3-upload');

const db = mysql.createConnection(dataBase);
db.connect();

const app = express();

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결 
// 브라우저에서 오는 응답이 json 일수도 있고, 아닐 수도 있으므로 urlencoded() 도 추가한다.
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// CORS 설정
app.use(cors());

const port = 20000;

const s3 = multer();

// 로그인
app.get("/member/login", (req, res) => {
  db.query(sql_login, [req.query.code], (err, results, fields) => {
    if (err) { res.send(''); return; }
    if(results.length > 0){
      res.json(results[0]);
    } else {
      res.send('');
    }
  });
})

// 회원가입
app.post("/member/join", (req, res) => {
  db.query(sql_join, [req.body.code],(err, results, fields) => {
    if (err) { res.send(''); return; }
    res.json({id: results.insertId});
  });
})

// 멤버 컨테이너 모두 받아오기
app.get("/container", async (req, res) => {
  const { id, page, limit, sort, term } = req.query;
  if(id == -1) {
    return;
  }

  const data = {}
  db.query(sql_get_containers_count, [id], (err, results, fields) => {
    if (err) { console.log(err); res.send('[]'); return; }
    data.count = results[0].count;

    let sql_get_containers = `SELECT * FROM container WHERE mid = ?`;
    if(term){
      const terms = term.split(',');
      sql_get_containers = `${sql_get_containers} and createtime BETWEEN '${terms[0]} 00:00:00' and '${terms[1]} 23:59:59'`;
    }
    sql_get_containers = `${sql_get_containers} ORDER BY ID`;
    console.log(sort);
    if(sort === '0') {
      console.log('desc');
      sql_get_containers = `${sql_get_containers} desc`;
    }
    sql_get_containers = `${sql_get_containers} limit ?, ?`;
    console.log(sql_get_containers);
    db.query(sql_get_containers, [id, (page - 1) * limit, Number(limit)], (err, results, fields) => {
      if (err) { return; }
      data.results = results;
      res.json(data);
    })
  })
})

// 이미지 메인화면에 추가
app.post("/main/dropimage", s3.array('files'), async (req, res) => {
  const data = await upload(req.body.mid, req.files);
  res.send(data);
})

// 멤버 컨테이너 추가
app.post("/container", (req, res) => {
  const { mid, files } = req.body;
  console.log(mid, files);
  db.query(sql_insert_containers, [mid, files[0], files.join(',')], (err, results, fields) => {
    if (err) { res.send('[]'); console.log("err", err); return; }
    console.log("success", results);
    res.json(results);
  })
});

//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`Success listening at http://localhost:${port}`);
});