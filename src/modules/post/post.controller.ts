import { Request, Response } from "express";
import { postService } from "./post.service";

// create new post
const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized",
      });
    }
    const result = await postService.createPost(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};

// get all post
const getAllPost = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    const { search } = req.query;
    const result = await postService.getAllPost(search as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "something went wrong",
      details: error,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
