import axios from "axios";

// API service functions for post-related operations
const API_URL = axios.create({
  baseURL: "http://localhost:8000/api/v1.0/posts",
  withCredentials: true,
});

// Handles API errors and formats them consistently
const handleApiError = (err) => {
  const status = err.response?.status || 500;
  const data = err.response?.data;
  const rawDetail = data?.detail ?? data?.message;
  const detail =
    typeof rawDetail === "string"
      ? rawDetail
      : Array.isArray(rawDetail)
        ? rawDetail
            .map((message) =>
              typeof message === "string" ? message : message?.msg
            )
            .join(", ")
        : "Something went wrong";

  return { ok: false, status, data, detail };
};

// Searches for posts based on post type
const posts_by_post_type = async (data) => {
  try {
    const res = await API_URL.get("/search", { params: data });
    return {
      ok: true,
      data: res.data,
      status: res.status,
      detail: null,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Creates a new post/story
const createPost = async (data) => {
  try {
    const res = await API_URL.post("/newStory", data);
    return {
      ok: true,
      data: res.data,
      status: res.status,
      detail: null,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Deletes a post by its ID
const deletePost = async (post_id) => {
  try {
    const res = await API_URL.delete(`delete/${post_id}`);
    return {
      ok: true,
      data: res.data,
      status: res.status,
      detail: null,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export { createPost, deletePost, posts_by_post_type };
