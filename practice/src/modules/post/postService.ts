import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  authorId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId,
    },
  });

  return result;
};

// get posts
const getAllPost = async (
  search: string,
  tags: string[],
  isFeatured: boolean,
  authorId: string,
  page: number,
  limit: number,
  skip: number
) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFetured: isFeatured,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    pagination: {
      total,
      limit,
      page,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        comments: {
          where: {
            parentId: null,
          },
          include: {
            replies: {
              include: {
                replies: {
                  include: {
                    replies: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  return result;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
};
