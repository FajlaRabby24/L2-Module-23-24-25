import { Request, Response } from "express";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
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
    const { search } = req.query;
    const searchQuery = search ? search : "";
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : false;
    const authorId = req.query.authorId || "";

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;

    const options = paginationSortingHelper(req.query);

    const result = await postService.getAllPost(
      searchQuery as string,
      tags,
      isFeatured,
      authorId as string,
      page,
      limit,
      skip,
      sortBy as string | undefined,
      sortOrder as string | undefined
    );

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
