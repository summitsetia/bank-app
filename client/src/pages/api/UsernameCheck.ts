import client from "./axiosClient";

const checkUsername = async (username: string): Promise<any> => {
  const response = await client.post('/usernameCheck', { username });
  return response.data;
};


export default checkUsername;