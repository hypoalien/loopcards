import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.loopcards.co",
  // baseURL: "https://drab-plum-bighorn-sheep-shoe.cyclic.app",
  // other custom configuration options
});

export default instance;
