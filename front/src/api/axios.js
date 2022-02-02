import axios from 'axios';
import qs from 'qs';
const baseUrl = 'https://www.nork.so/nork/keeper/server';
const baseUrl_dev = 'http://localhost:20000';


export const get = async (url, data) => {
  // const req = await axios.get(`${baseUrl_dev}${url}/${data.join('/')}`);
  const req = await axios.get(baseUrl_dev + url, {params: data});
  return req.data;
}

export const post = async (url, data) => {
  const req = await axios.post(baseUrl_dev + url, data);
  return req.data;
}

export const patch = async (url, data) => {
  const req = await axios.patch(baseUrl_dev + url, data);
  return req.data;
}