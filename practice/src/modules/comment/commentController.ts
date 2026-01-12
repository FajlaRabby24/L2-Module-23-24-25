import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from "./commentService";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;

    const result = await commentService.createComment(req.body);
    sendResponse(res, 201, true, "comment created successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "comment create failed!", error);
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const result = await commentService.getCommentById(
      req.params.commentId as string
    );
    sendResponse(res, 200, true, "comment retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "comment retrived failed!", error);
  }
};

const getAllComment = async (req: Request, res: Response) => {
  try {
    const result = await commentService.getAllComment();
    sendResponse(res, 200, true, "comments retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "comments retrived failed!", error);
  }
};

const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const result = await commentService.getCommentByAuthorId(
      req.params.authorId as string
    );
    sendResponse(res, 200, true, "comments retrived successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "comments retrived failed!", error);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await commentService.deleteComment(
      req.params.commentId as string,
      user?.id as string
    );
    sendResponse(res, 200, true, "comments deleted successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "comments delete failed!");
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await commentService.updateComment(
      req.params.commentId as string,
      req.body,
      user?.id as string
    );
    sendResponse(res, 200, true, "comments updated successfully!", result);
  } catch (error) {
    sendResponse(res, 400, false, "comments update failed!");
  }
};

export const commentController = {
  createComment,
  getCommentById,
  getAllComment,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
};
