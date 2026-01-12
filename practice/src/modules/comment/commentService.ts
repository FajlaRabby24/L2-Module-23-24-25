import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
          authorId: true,
        },
      },
    },
  });

  return result;
};

const getAllComment = async () => {
  return await prisma.comment.findMany();
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });

  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  const result = await prisma.comment.delete({
    where: {
      id: commentId,
    },
    select: {
      id: true,
    },
  });

  return result;
};

// update comment by id
const updateComment = async (
  commentId: string,
  data: { content?: string; status?: CommentStatus },
  authorId: string
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid!");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentById,
  getAllComment,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
};
