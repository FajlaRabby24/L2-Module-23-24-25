import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./postService";

// new post create
const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(
      req.body,
      req.user?.id as string
    );
    sendResponse(res, 201, true, "post create successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "post creation failed!", error);
  }
};

// get all post
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured === "true" ? true : false;
    const authorId = req.query.authorId;

    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const result = await postService.getAllPost(
      search as string,
      tags,
      isFeatured,
      authorId as string,
      page,
      limit,
      skip
    );

    sendResponse(res, 200, true, "Posts retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "post creation failed!", error);
  }
};

// get post by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const result = await postService.getPostById(req.params.postId as string);
    sendResponse(res, 200, true, "Post retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "post retrived failed!", error);
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
};
