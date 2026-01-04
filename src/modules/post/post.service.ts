import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// create new post
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

// get post
const getAllPost = async (
  payload: string,
  tags: string[] | [],
  isFeatured: boolean
) => {
  console.log({ isFeatured });

  const result = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: payload as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload as string,
          },
        },
      ],
      tags: {
        hasEvery: tags,
      },
      isFeatured: isFeatured,
    },
  });

  return result;
};

export const postService = {
  createPost,
  getAllPost,
};
