import client from "./axiosClient";

const usernameCheck = async (userData: { username: string }): Promise<any> => {
  const response = await client.post('/usernameCheck', userData);
  return response.data;
};


export default usernameCheck;