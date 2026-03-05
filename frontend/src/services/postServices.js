import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1.0/posts",
  withCredentials: true,
});

const get_all_posts = async () => {
  const res = await API_URL.get("/all");
  return res.data;
};

const createPost = async (data) => {
  const res = await API_URL.post("/newStory", data);
  return res.data;
};

const deletePost = async (post_id) => {
  const res = await API_URL.delete(`/${post_id}`);
  return res.data;
};

export { createPost, deletePost, get_all_posts };
