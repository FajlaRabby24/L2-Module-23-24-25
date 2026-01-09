// import { Post } from "../../../generated/prisma/client";
// import { prisma } from "../../lib/prisma";

// // create new post
// const createPost = async (
//   data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
//   userId: string
// ) => {
//   const result = await prisma.post.create({
//     data: {
//       ...data,
//       authorId: userId,
//     },
//   });
//   return result;
// };

// // get post
// const getAllPost = async (
// payload: string,
// tags: string[] | [],
// isFeatured: boolean,
// authorId: string,
// page: number,
// limit: number,
// skip: number,
// sortBy: string,
// sortOrder: string
// ) => {
//   const result = await prisma.post.findMany({
//     take: limit,
//     skip,
//     where: {
//       OR: [
//         {
//           title: {
//             contains: payload as string,
//             mode: "insensitive",
//           },
//         },
//         {
//           content: {
//             contains: payload as string,
//             mode: "insensitive",
//           },
//         },
//         {
//           tags: {
//             has: payload as string,
//           },
//         },
//       ],
//       tags: {
//         hasEvery: tags,
//       },
//       isFeatured: isFeatured,
//       authorId: {
//         contains: authorId,
//       },
//     },
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//   });

//   const total = await prisma.post.count({

//   })

//   return result;
// };

// export const postService = {
//   createPost,
//   getAllPost,
// };

import { CommentStatus, Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

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

const getAllPost = async (
  search: string,
  tags: string[] | [],
  isFeatured: boolean,
  authorId: string,
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string
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
        {
          tags: {
            has: search,
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
      isFeatured,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: allPost,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

// get post by id
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

    const result = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                },
              },
            },
          },
        },
      },
    });
    return result;
  });

  return result;
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
};
