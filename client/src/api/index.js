import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const GetPosts = async () => await API.get("api/post/");
export const CreatePost = async (data) => await API.post("api/post/", data);
export const GenerateAIImage = async (data) =>
  await API.post("api/generateImage", data);
