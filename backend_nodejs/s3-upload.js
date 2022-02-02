const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const path = require('path');
const sharp = require("sharp");
 
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint : 'https://kr.object.ncloudstorage.com',
    region : 'kr-standard'
});

const upload = async (mid, files) => {
  const now = getTime();
  const res = [];
  let idx = 0;
  for await (const v of files){ 

    let buf = null;
    let fm = format(v.mimetype);
    let name = ``;
    const origin_buf_length = v.buffer.length; // 원본 크기
    const pad = idx.toString().padStart(3,'0'); // 3의 길이에서 string의 부족한 길이만큼 0으로 채운다
    const ext = path.extname(v.originalname); // 확장자
    const count = idx === 0 ? 3 : 2; // 첫번째 이미지면 썸네일도 필요하기 때문에 3번째를 썸네일로 사용
    res.push(`${now}_${pad}${ext}`);
    for(let i = 0; i < count; i++){
      // 이름은 종류별로
      // 0 : 원본
      // 1 : 상세페이지에서 미리보기 이미지
      // 2 : 썸네일
      name = `${now}_${pad}_${i}${ext}`;
      if(i === 0) {
        buf = v.buffer;
      } else if (i === 1) {
        buf = await resize(v.buffer, 122, fm);
      } else if (i === 2) {
        buf = await resize(v.buffer, 536, fm);
      }

      // 리사이징 후 크기가 원래 크기보다 크면 원래꺼 사용
      if(buf.length > origin_buf_length){
        buf = v.buffer;
      }

      const param = {
        'Bucket':'nork',
        'Key': `keeper/member/${mid}/${name}`,
        'ACL':'public-read',
        'Body': buf,
        'ContentType': v.mimetype
      }
      
      s3.upload(param, function(err, data){
          if(err) {
              console.log('err', err);
          }
          console.log('success', data);
      });
    }

    idx++;
  }
  return res;
}

const resize = async (buffer, width, format) => {
  const buf = await sharp(buffer)
        .resize(width)
        .toFormat(format)
        .toBuffer();
  return buf;
}

const format = (mimetype) => {
  switch(mimetype.toLowerCase()){
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    default:
      return null;
  }
}

const getTime = () => {
  const today = new Date();
  const year = today.getFullYear().toString().padStart(4,'0');
  const month = (today.getMonth() + 1).toString().padStart(2,'0');
  const date = today.getDate().toString().padStart(2,'0');
  const hour = today.getHours().toString().padStart(2,'0');
  const minute = today.getMinutes().toString().padStart(2,'0');
  const second = today.getSeconds().toString().padStart(2,'0');
  return `${year}${month}${date}${hour}${minute}${second}`;
}

module.exports = { upload };