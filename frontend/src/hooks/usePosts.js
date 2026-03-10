import { useState } from "react";
import {
  createPost,
  posts_by_post_type,
  deletePost,
  downloadPDF,
} from "../services/postServices";

// Custom hook for managing post-related operations
export const UsePosts = () => {
  const [loading, setLoading] = useState(false);

  // Fetches posts based on post type
  const fetch_posts = async (data) => {
    setLoading(true);
    try {
      const res = await posts_by_post_type(data);
      if (!res.ok) {
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  // Creates a new post
  const create_post = async (data) => {
    try {
      const res = await createPost(data);
      if (!res.ok) {
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  // Deletes a post by its ID
  const delete_post = async (post_id) => {
    try {
      const res = await deletePost(post_id);
      if (!res.ok) {
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  // download post as pdf format
  const download_as_pdf = async (post_id) => {
    try {
      const res = await downloadPDF(post_id);
      if (!res.ok) {
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { fetch_posts, loading, delete_post, create_post, download_as_pdf };
};
