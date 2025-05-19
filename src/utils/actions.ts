"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { imagekit } from "./utils";

// --- Utility Upload Function ---
const uploadFile = async (file: File, imgType: string): Promise<UploadResponse> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const transformation = `w-600,${
    imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
  }`;

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: buffer,
        fileName: file.name,
        folder: "/posts",
        ...(file.type.includes("image") && {
          transformation: {
            pre: transformation,
          },
        }),
      },
      function (error, result) {
        if (error) reject(error);
        else resolve(result as UploadResponse);
      }
    );
  });
};

// --- Follow ---
export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();
  if (!userId || userId === targetUserId) return;

  const existing = await prisma.follow.findFirst({
    where: { followerId: userId, followingId: targetUserId },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({ data: { followerId: userId, followingId: targetUserId } });
  }
};

// --- Post Actions ---
export const likePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.like.findFirst({ where: { userId, postId } });
  existing
    ? await prisma.like.delete({ where: { id: existing.id } })
    : await prisma.like.create({ data: { userId, postId } });
};

export const rePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.post.findFirst({ where: { userId, rePostId: postId } });
  existing
    ? await prisma.post.delete({ where: { id: existing.id } })
    : await prisma.post.create({ data: { userId, rePostId: postId } });
};

export const savePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.savedPosts.findFirst({ where: { userId, postId } });
  existing
    ? await prisma.savedPosts.delete({ where: { id: existing.id } })
    : await prisma.savedPosts.create({ data: { userId, postId } });
};

// --- List Actions ---
export const likeList = async (listId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.like.findFirst({ where: { userId, listId } });
  existing
    ? await prisma.like.delete({ where: { id: existing.id } })
    : await prisma.like.create({ data: { userId, listId } });
};

export const rePostList = async (listId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.list.findFirst({
    where: { userId, rePostListId: listId }, // if you have repost field in list
  });

  existing
    ? await prisma.list.delete({ where: { id: existing.id } })
    : await prisma.list.create({ data: { userId, rePostListId: listId, title: "Repost", desc: "" } });
};

export const saveList = async (listId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.savedLists.findFirst({ where: { userId, listId } });
  existing
    ? await prisma.savedLists.delete({ where: { id: existing.id } })
    : await prisma.savedLists.create({ data: { userId, listId } });
};

// --- Create Post ---
export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  const validated = z
    .object({
      desc: z.string().max(140),
      isSensitive: z.boolean().optional(),
    })
    .safeParse({
      desc,
      isSensitive: JSON.parse(isSensitive),
    });

  if (!validated.success) return { success: false, error: true };

  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file?.size) {
    const upload = await uploadFile(file, imgType as string);
    if (upload.fileType === "image") {
      img = upload.filePath;
      imgHeight = upload.height;
    } else {
      video = upload.filePath;
    }
  }

  await prisma.post.create({
    data: {
      ...validated.data,
      userId,
      img,
      imgHeight,
      video,
    },
  });

  revalidatePath("/");
  return { success: true, error: false };
};

// --- Delete a Post ---
export const deletePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.userId !== userId) return;

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/");
};

// --- Create List ---
export const createList = async (title: string, items: string[]) => {
  const { userId } = await auth();
  if (!userId || items.length !== 10) return null;

  const list = await prisma.list.create({
    data: {
      userId,
      title,
      items: {
        create: items.map((content, index) => ({
          content,
          position: index + 1,
        })),
      },
    },
  });

  revalidatePath("/");
  return list;
};

// --- Update a List (title + items) ---
export const updateList = async (
  listId: number,
  newTitle: string,
  newItems: string[]
) => {
  const { userId } = await auth();
  if (!userId || newItems.length !== 10) return;

  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { items: true },
  });

  if (!list || list.userId !== userId) return;

  // Delete old items and recreate
  await prisma.$transaction([
    prisma.list.update({
      where: { id: listId },
      data: { title: newTitle },
    }),
    prisma.listItem.deleteMany({ where: { listId } }),
    prisma.listItem.createMany({
      data: newItems.map((content, index) => ({
        content,
        position: index + 1,
        listId,
      })),
    }),
  ]);

  revalidatePath("/");
};

// --- Delete a List ---
export const deleteList = async (listId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list || list.userId !== userId) return;

  await prisma.$transaction([
    prisma.listItem.deleteMany({ where: { listId } }),
    prisma.list.delete({ where: { id: listId } }),
  ]);

  revalidatePath("/");
};

// --- Comment (on Post or List) ---
export const addComment = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const content = formData.get("desc")?.toString();
  const postId = formData.get("postId");
  const listId = formData.get("listId");
  const username = formData.get("username");

  if (!content || content.length > 255) return { success: false, error: true };

  try {
    await prisma.comment.create({
      data: {
        content,
        userId,
        postId: postId ? Number(postId) : undefined,
        listId: listId ? Number(listId) : undefined,
      },
    });

    const path = postId
      ? `/${username}/status/${postId}`
      : listId
      ? `/${username}/lists/${listId}`
      : "/";

    revalidatePath(path);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
