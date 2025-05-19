import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Create Users ---
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        id: `user${i}`,
        email: `user${i}@example.com`,
        username: `user${i}`,
        displayName: `User ${i}`,
        bio: `Hello, I'm user${i}.`,
        location: "Earth",
        job: "Developer",
        website: "https://example.com",
      },
    });
    users.push(user);
  }

  // --- Create Posts ---
  const posts = [];
  for (const user of users) {
    for (let i = 0; i < 5; i++) {
      const post = await prisma.post.create({
        data: {
          userId: user.id,
          desc: `Post ${i + 1} by ${user.username}`,
        },
      });
      posts.push(post);
    }
  }

  // --- Create Lists with 10 Items ---
  const lists = [];
  for (const user of users) {
    const list = await prisma.list.create({
      data: {
        title: `Top 10 by ${user.username}`,
        desc: `List description for ${user.username}`,
        userId: user.id,
        items: {
          create: Array.from({ length: 10 }, (_, i) => ({
            content: `Item ${i + 1} by ${user.username}`,
            position: i + 1,
          })),
        },
      },
    });
    lists.push(list);
  }

  // --- Create Follows ---
  await prisma.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[1].id, followingId: users[2].id },
      { followerId: users[2].id, followingId: users[3].id },
      { followerId: users[3].id, followingId: users[4].id },
      { followerId: users[4].id, followingId: users[0].id },
    ],
  });

  // --- Create Likes on Posts ---
  await prisma.like.createMany({
    data: [
      { userId: users[0].id, postId: posts[0].id },
      { userId: users[1].id, postId: posts[1].id },
      { userId: users[2].id, postId: posts[2].id },
      { userId: users[3].id, postId: posts[3].id },
      { userId: users[4].id, postId: posts[4].id },
    ],
  });

  // --- Create Likes on Lists ---
  await prisma.like.createMany({
    data: [
      { userId: users[0].id, listId: lists[1].id },
      { userId: users[2].id, listId: lists[3].id },
    ],
  });

  // --- Create Comments on Posts ---
  for (let i = 0; i < posts.length; i++) {
    await prisma.comment.create({
      data: {
        content: `Comment on post ${posts[i].id}`,
        userId: users[(i + 1) % 5].id,
        postId: posts[i].id,
      },
    });
  }

  // --- Create Comments on Lists ---
  for (let i = 0; i < lists.length; i++) {
    await prisma.comment.create({
      data: {
        content: `Nice list ${lists[i].title}!`,
        userId: users[(i + 2) % 5].id,
        listId: lists[i].id,
      },
    });
  }

  // --- Create Reposts ---
  for (let i = 0; i < posts.length; i++) {
    await prisma.post.create({
      data: {
        userId: users[(i + 2) % 5].id,
        rePostId: posts[i].id,
        desc: `Repost of post ${posts[i].id}`,
      },
    });
  }

  // --- Create Saved Posts ---
  await prisma.savedPosts.createMany({
    data: [
      { userId: users[0].id, postId: posts[1].id },
      { userId: users[1].id, postId: posts[2].id },
      { userId: users[2].id, postId: posts[3].id },
      { userId: users[3].id, postId: posts[4].id },
      { userId: users[4].id, postId: posts[0].id },
    ],
  });

  // --- Create Saved Lists ---
  await prisma.savedLists.createMany({
    data: [
      { userId: users[0].id, listId: lists[1].id },
      { userId: users[1].id, listId: lists[2].id },
      { userId: users[2].id, listId: lists[3].id },
      { userId: users[3].id, listId: lists[4].id },
      { userId: users[4].id, listId: lists[0].id },
    ],
  });

  console.log("✅ Seed data created successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
