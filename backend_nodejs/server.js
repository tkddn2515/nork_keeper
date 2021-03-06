const express = require("express");
const cors = require('cors');
const mysql      = require('mysql2');
const multer = require('multer');

const { sql_login, sql_join, sql_get_containers_count, sql_insert_containers, sql_get_tags, sql_change_container_name, sql_change_container_tag, sql_insert_tag, sql_change_container_concept, sql_change_container_img } = require('./query');
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
  const { id, page, limit, sort, term, tag } = req.query;
  if(id == -1) {
    return;
  }
  console.log("container", req.query);
  const data = {}
  db.query(sql_get_containers_count, [id], (err, results, fields) => {
    if (err) { res.send('[]'); return; }
    data.count = results[0].count;

    let sql_get_containers = `SELECT * FROM container WHERE mid = ?`;
    if(term){
      const terms = term.split(',');
      sql_get_containers = `${sql_get_containers} and createtime BETWEEN '${terms[0]} 00:00:00' and '${terms[1]} 23:59:59'`;
    }
    if(tag) {
      const tags = tag.split(',¡¿');
      let orTags = "";
      tags.forEach((v, idx) => {
        if(idx === 0) {
          orTags = `tags LIKE '%${v}%'`;
        } else {
          orTags = `${orTags} or tags LIKE '%${v}%'`;
        }
      })
      sql_get_containers = `${sql_get_containers} and (${orTags})`;
    }
    
    sql_get_containers = `${sql_get_containers} ORDER BY ID`;
    if(sort === '0') {
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

// 멤버 태그 모두 받아오기
app.get("/tag", async (req, res) => {
  const { mid } = req.query;
  if(mid == -1) {
    return;
  }

  db.query(sql_get_tags, [mid], (err, results, fields) => {
    if (err) { res.send('[]'); return; }
    res.json(results);
  })
})


// 이미지 메인화면에 추가
app.post("/main/dropimage", s3.array('files'), async (req, res) => {
  const data = await upload(req.body.mid, req.files, true);
  res.send(data);
})

// 이미지 상세화면에 추가
app.post("/detail/dropimage", s3.array('files'), async (req, res) => {
  const data = await upload(req.body.mid, req.files, false);
  res.send(data);
})

// 멤버 컨테이너 추가
app.post("/container", (req, res) => {
  const { mid, files } = req.body;
  db.query(sql_insert_containers, [mid, files[0], files.join(',')], (err, results, fields) => {
    if (err) { res.send('[]'); return; }
    res.json(results);
  })
});

// 컨테이너 이름 변경
app.patch("/container/name", (req, res) => {
  const { id, name } = req.body;
  console.log("req.body", req.body);
  db.query(sql_change_container_name, [name, id], (err, results, fields) => {
    if (err) { console.log("err", err); return; }
    console.log("results", results);
    res.json(results);
  })
})

// 컨테이너 태그 변경
app.patch("/container/tags", (req, res) => {
  const { id, mid, tags } = req.body;
  console.log("req.body", req.body);
  db.query(sql_change_container_tag, [tags, id], (err, results, fields) => {
    if (err) { console.log("err", err); return; }
    console.log("results", results);
    const tagsJoin = tags.split(',');
    let value = tagsJoin[tagsJoin.length - 1];
    console.log("value", value);
    db.query(sql_insert_tag, [mid, value], (err, results, fields) => {
      if (err) { console.log("err", err); return; }
      console.log("results", results);
      res.send(true);
    })
  })
})

// 컨테이너 내용 변경
app.patch("/container/concept", (req, res) => {
  const { id, concept } = req.body;
  console.log("req.body", req.body);
  db.query(sql_change_container_concept, [concept, id], (err, results, fields) => {
    if (err) { console.log("err", err); return; }
  })
})

// 컨테이너 이미지 변경
app.patch("/container/imgs", (req, res) => {
  const { id, imgs } = req.body;
  console.log("req.body", req.body);
  db.query(sql_change_container_img, [imgs.join(','), id], (err, results, fields) => {
    if (err) { console.log("err", err); return; }
    console.log("success", results);
    res.send("success");
  })
})

app.get("/test", (req, res) => {
  const sql = `SELECT * FROM container`;
  db.query(sql, [], (err, results, fields) => {
    if (err) { res.send('[]'); return; }
    results.forEach((v, idx) => {
      const t = getTime(idx);
      const sql2 = `UPDATE container SET createtime = ? WHERE id = ${v.id}`;
      db.query(sql2, [t]);
    })
  })
});

const getTime = (addDay) => {
  let today = new Date();
  today.setDate(today.getDate() + addDay);
  const year = today.getFullYear().toString().padStart(4,'0');
  const month = (today.getMonth() + 1).toString().padStart(2,'0');
  const date = today.getDate().toString().padStart(2,'0');
  const hour = today.getHours().toString().padStart(2,'0');
  const minute = today.getMinutes().toString().padStart(2,'0');
  const second = today.getSeconds().toString().padStart(2,'0');
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
}

//port에 접속 성공하면 콜백 함수를 실행시킨다.
app.listen(port, () => {
  console.log(`Success listening at http://localhost:${port}`);
});