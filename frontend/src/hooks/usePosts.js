import { useState } from "react";
import {
  createPost,
  getAllPosts,
  deletePost,
  downloadPdf,
} from "../services/postServices";

export const UsePosts = () => {
  const [loading, setLoading] = useState(false);

  // req data handler
  const request_handler = async (func) => {
    setLoading(true);
    try {
      const result = await func();
      return result;
    } finally {
      setLoading(false);
    }
  };

  // all posts hook
  const fetch_posts = async () => {
    return await request_handler(() => getAllPosts());
  };

  // new posts hook
  const create_post = async (data) => {
    return await request_handler(() => createPost(data));
  };

  // delete posts hook
  const delete_post = async (post_id) => {
    return await request_handler(() => deletePost(post_id));
  };

  // download pdf hook
  const download_pdf = async (post_id) => {
    return await request_handler(() => downloadPdf(post_id));
  };

  // return all hooks
  return { fetch_posts, loading, delete_post, create_post, download_pdf };
};
