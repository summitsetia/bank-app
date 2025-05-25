import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5173",
  withCredentials: true 
});

export default client;
