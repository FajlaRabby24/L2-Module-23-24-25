import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../../constant";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.service";

// create new post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
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
    // res.status(400).json({
    //   error: "post creation failed",
    //   details: error,
    // });
    next(error);
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

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postService.getAllPost(
      searchQuery as string,
      tags,
      isFeatured,
      authorId as string,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "something went wrong",
      details: error,
    });
  }
};

// get post by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const result = await postService.getPostById(req.params.postId as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: "post retrived failed",
      details: error,
    });
  }
};

// get my posts
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const result = await postService.getMyPosts(user?.id as string);
    sendResponse(res, 200, true, "Post retrived successfully!", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "post retrived failed";
    sendResponse(res, 400, false, errorMessage);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const isAdmin = user.role === UserRoles.ADMIN;

    const postId = req.params.postId;

    const result = await postService.updatePost(
      postId as string,
      req.body,
      user?.id as string,
      isAdmin
    );

    sendResponse(res, 200, true, "Post updated successfully!", result);
  } catch (error) {
    // const errorMessage =
    // error instanceof Error ? error.message : "post retrived failed";
    // sendResponse(res, 400, false, "Post updated failed!", error);
    next(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const isAdmin = user.role === UserRoles.ADMIN;

    const postId = req.params.postId;

    const result = await postService.deletePost(
      postId as string,
      user?.id as string,
      isAdmin
    );

    sendResponse(res, 200, true, "Post deleted successfully!", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "post delete failed";
    sendResponse(res, 400, false, errorMessage);
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStats();

    sendResponse(res, 200, true, "Stats fetched successfully!", result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Stats fetched failed";
    sendResponse(res, 400, false, errorMessage);
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
