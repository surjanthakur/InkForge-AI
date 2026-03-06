import { useState } from "react";
import {
  createPost,
  get_all_posts,
  deletePost,
} from "../services/postServices";

export const UsePosts = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const all_posts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await get_all_posts();
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const create_post = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await createPost(data);
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create post");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const delete_post = async (post_id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await deletePost(post_id);
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete post");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { all_posts, create_post, delete_post, loading, error };
};
