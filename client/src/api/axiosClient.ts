import axios from "axios";

const client = axios.create({
  baseURL: "https://api.bank.summitsetia.com",
  withCredentials: true 
});

export default client;
