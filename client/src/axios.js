import axios from "axios";

const instance = axios.create({
  //   baseURL: "https://raveindia.herokuapp.com"
  baseURL: "https://localhost:5000",
});

export default instance;
