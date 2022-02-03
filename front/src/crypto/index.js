import CryptoJS from "crypto-js";

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, process.env.REACT_APP_CRTYPT_KEY).toString();
}

export const decrypt = (data) => {
  try {
    const bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_CRTYPT_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch(err) {
    console.error(err);
    return null;
  }
}