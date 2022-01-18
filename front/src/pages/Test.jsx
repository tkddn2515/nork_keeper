import { get, post } from '../api/axios';

const Test = () => {

  const onClickGetAll = async () => {
    const res = await get("/users");
    console.log(res);
  }

  const onClickGetById = async () => {
    const data = {
      id: 1
    }
    const res = await get("/users/user_id", data);
    console.log(res);
  }

  const onClickPost = async () => {
    const data = {
      id: 1,
      name: "sangwoo",
      state: "love"
    }
    const res = await post("/users/insert", data);
    console.log(res);
  }

  return (
    <>
      <button onClick={onClickGetAll}>Get All</button>
      <button onClick={onClickGetById}>Get by Id</button>
      <button onClick={onClickPost}>Post</button>
    </>
  )
}

export default Test;